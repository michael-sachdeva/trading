"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleReset(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${location.origin}/reset-password`,
    });
    if (error) {
      setError(error.message);
      return;
    }
    setSent(true);
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-hero-gradient px-4">
      <div className="card w-full max-w-md">
        <h1 className="font-display text-2xl font-bold text-navy">Reset your password</h1>
        <p className="mt-1 text-sm text-navy/60">We'll email you a reset link.</p>

        {sent ? (
          <p className="mt-6 rounded-lg bg-royal-50 p-4 text-sm text-royal-700">
            Check your inbox for a password reset link.
          </p>
        ) : (
          <form onSubmit={handleReset} className="mt-6 space-y-4">
            <div>
              <label className="text-sm font-medium text-navy">Email</label>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full rounded-lg border border-navy/10 px-4 py-2.5 outline-none focus:border-royal focus:ring-2 focus:ring-royal/20"
              />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button type="submit" className="btn-primary w-full">
              Send reset link
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
