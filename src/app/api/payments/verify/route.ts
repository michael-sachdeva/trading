import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { createClient } from "@/lib/supabase/server";

/**
 * Called from the client immediately after Razorpay Checkout's success
 * handler fires. Verifies the payment signature before granting access —
 * this is a defense-in-depth check; the webhook below is the source of
 * truth and will also confirm/settle the order server-to-server.
 */
export async function POST(request: NextRequest) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await request.json();

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const { data: order } = await supabase
    .from("orders")
    .select("*")
    .eq("razorpay_order_id", razorpay_order_id)
    .eq("user_id", user.id)
    .single();

  if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

  // Record the payment (idempotent on razorpay_payment_id unique constraint).
  await supabase.from("payments").upsert(
    {
      order_id: order.id,
      razorpay_payment_id,
      razorpay_signature,
      amount_inr: order.amount_inr,
      status: "captured",
    },
    { onConflict: "razorpay_payment_id" }
  );

  await supabase.from("orders").update({ status: "paid" }).eq("id", order.id);

  // Unlock the plan: replace any existing enrollment row.
  await supabase.from("enrollments").upsert(
    {
      user_id: user.id,
      plan_id: order.plan_id,
      order_id: order.id,
      active: true,
    },
    { onConflict: "user_id" }
  );

  return NextResponse.json({ success: true });
}
