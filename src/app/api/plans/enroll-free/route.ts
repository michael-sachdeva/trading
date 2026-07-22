"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

function CheckoutInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const supabase = createClient();
  const planSlug = searchParams.get("plan") ?? "basic";
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    document.body.appendChild(script);
  }, []);

  async function handlePay() {
    setLoading(true);
    setError(null);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push(`/login?redirectedFrom=/checkout?plan=${planSlug}`);
        return;
      }

      if (planSlug === "free") {
        const res = await fetch("/api/plans/enroll-free", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ planSlug }),
        });
        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
          setError(data.error ?? "Something went wrong.");
          setLoading(false);
          return;
        }

        router.push("/dashboard");
        return;
      }

      const res = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planSlug }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data.error ?? "Something went wrong creating the order.");
        setLoading(false);
        return;
      }

      const options = {
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: "TradeMaster AI Academy",
        description: `${planSlug} plan`,
        order_id: data.razorpayOrderId,
        handler: async function (response: any) {
          const verifyRes = await fetch("/api/payments/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(response),
          });
          if (verifyRes.ok) {
            router.push("/dashboard");
          } else {
            setError("Payment verification failed.");
          }
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
          },
        },
        theme: { color: "#0057FF" },
      };

      // @ts-ignore
      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function () {
        setError("Payment failed. Please try again.");
        setLoading(false);
      });
      rzp.open();
      setLoading(false);
    } catch (err: any) {
      setError(err?.message ?? "Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  const isFree = planSlug === "free";

  return (
    <main className="flex min-h-screen items-center justify-center bg-hero-gradient px-4">
      <div className="card w-full max-w-md text-center">
        <h1 className="font-display text-2xl font-bold text-navy">Checkout</h1>
        <p className="mt-2 text-sm text-navy/60">Plan: {planSlug}</p>
        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
        <button onClick={handlePay} disabled={loading} className="btn-primary mt-6 w-full">
          {loading ? "Loading…" : isFree ? "Start Free" : "Pay Now"}
        </button>
      </div>
    </main>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={null}>
      <CheckoutInner />
    </Suspense>
  );
}