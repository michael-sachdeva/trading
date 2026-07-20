import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { razorpay } from "@/lib/razorpay";

/**
 * Creates a Razorpay order for a plan purchase or upgrade.
 * For upgrades, the amount is the difference between the target plan's
 * price and the price of the plan the user already holds — never the
 * full price again.
 */
export async function POST(request: NextRequest) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { planSlug, couponCode } = await request.json();

  const { data: targetPlan, error: planErr } = await supabase
    .from("plans")
    .select("*")
    .eq("slug", planSlug)
    .single();
console.log("PLAN QUERY DEBUG", { planSlug, targetPlan, planErr });
 if (planErr || !targetPlan) {
    return NextResponse.json(
      { error: `Invalid plan: ${planErr?.message ?? "not found"} (slug: ${planSlug})` },
      { status: 400 }
    );
  }

  // Check existing enrollment to compute upgrade pricing
  const { data: existingEnrollment } = await supabase
    .from("enrollments")
    .select("*, plans(*)")
    .eq("user_id", user.id)
    .eq("active", true)
    .maybeSingle();

  let amount = Number(targetPlan.price_inr);
  let orderType: "purchase" | "upgrade" = "purchase";
  let fromPlanId: string | null = null;

  if (existingEnrollment) {
    const currentPlan = existingEnrollment.plans as any;
    if (currentPlan.tier >= targetPlan.tier) {
      return NextResponse.json(
        { error: "You already have this plan or a higher one." },
        { status: 400 }
      );
    }
    orderType = "upgrade";
    fromPlanId = currentPlan.id;
    amount = Number(targetPlan.price_inr) - Number(currentPlan.price_inr);
  }

  // Apply coupon if provided
  let couponId: string | null = null;
  if (couponCode) {
    const { data: coupon } = await supabase
      .from("coupons")
      .select("*")
      .eq("code", couponCode)
      .eq("is_active", true)
      .maybeSingle();

    if (coupon && (!coupon.max_uses || coupon.used_count < coupon.max_uses)) {
      couponId = coupon.id;
      amount =
        coupon.discount_type === "flat"
          ? Math.max(1, amount - Number(coupon.discount_value))
          : Math.max(1, amount * (1 - Number(coupon.discount_value) / 100));
    }
  }

  const amountPaise = Math.round(amount * 100);

  const razorpayOrder = await razorpay.orders.create({
    amount: amountPaise,
    currency: "INR",
    receipt: `order_rcpt_${Date.now()}`,
    notes: { userId: user.id, planSlug, orderType },
  });

  const { data: order, error: orderErr } = await supabase
    .from("orders")
    .insert({
      user_id: user.id,
      plan_id: targetPlan.id,
      order_type: orderType,
      from_plan_id: fromPlanId,
      amount_inr: amount,
      coupon_id: couponId,
      razorpay_order_id: razorpayOrder.id,
      status: "created",
    })
    .select()
    .single();

  if (orderErr) {
    return NextResponse.json({ error: orderErr.message }, { status: 500 });
  }

  return NextResponse.json({
    orderId: order.id,
    razorpayOrderId: razorpayOrder.id,
    amount: amountPaise,
    currency: "INR",
    keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
  });
}
