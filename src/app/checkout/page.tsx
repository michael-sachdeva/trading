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

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push(`/login?redirectedFrom=/checkout?plan=${planSlug}`);
      return;
    }

    const res = await fetch("/api/payments/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ planSlug }),
    });
    const data = await res.json();

    if (!res.ok) {
      setError(data.error ?? "Something went wrong.");
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
      theme: { color: "#0057FF" },
    };

    // @ts-ignore — loaded from the Razorpay script tag above
    const rzp = new window.Razorpay(options);
    rzp.open();
    setLoading(false);
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-hero-gradient px-4">
      <div className="card w-full max-w-md text-center">
        <h1 className="font-display text-2xl font-bold text-navy">Checkout</h1>
        <p className="mt-2 text-sm text-navy/60">Plan: {planSlug}</p>
        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
        <button onClick={handlePay} disabled={loading} className="btn-primary mt-6 w-full">
          {loading ? "Loading…" : "Pay Now"}
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