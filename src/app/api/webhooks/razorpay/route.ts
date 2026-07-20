import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { createAdminClient } from "@/lib/supabase/server";

/**
 * Razorpay webhook — this is the source of truth for payment state,
 * independent of whether the client-side redirect/verify call happened
 * (covers dropped connections, closed tabs, etc). Configure this URL in
 * the Razorpay dashboard: Settings > Webhooks, with events
 * "payment.captured", "payment.failed", "refund.processed".
 */
export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-razorpay-signature");

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET!)
    .update(rawBody)
    .digest("hex");

  if (signature !== expectedSignature) {
    return NextResponse.json({ error: "Invalid webhook signature" }, { status: 400 });
  }

  const payload = JSON.parse(rawBody);
  const event = payload.event;
  const supabase = createAdminClient();

  if (event === "payment.captured") {
    const payment = payload.payload.payment.entity;
    const razorpayOrderId = payment.order_id;

    const { data: order } = await supabase
      .from("orders")
      .select("*")
      .eq("razorpay_order_id", razorpayOrderId)
      .single();

    if (order) {
      await supabase.from("payments").upsert(
        {
          order_id: order.id,
          razorpay_payment_id: payment.id,
          razorpay_signature: signature,
          amount_inr: payment.amount / 100,
          status: "captured",
          raw_webhook_payload: payload,
        },
        { onConflict: "razorpay_payment_id" }
      );

      await supabase.from("orders").update({ status: "paid" }).eq("id", order.id);

      await supabase.from("enrollments").upsert(
        { user_id: order.user_id, plan_id: order.plan_id, order_id: order.id, active: true },
        { onConflict: "user_id" }
      );

      await supabase.from("notifications").insert({
        user_id: order.user_id,
        type: "purchase_success",
        title: "Payment successful",
        body: "Your course access has been unlocked.",
      });
    }
  }

  if (event === "payment.failed") {
    const payment = payload.payload.payment.entity;
    await supabase
      .from("orders")
      .update({ status: "failed" })
      .eq("razorpay_order_id", payment.order_id);
  }

  if (event === "refund.processed") {
    const refund = payload.payload.refund.entity;
    await supabase
      .from("payments")
      .update({ status: "refunded" })
      .eq("razorpay_payment_id", refund.payment_id);
  }

  return NextResponse.json({ received: true });
}
