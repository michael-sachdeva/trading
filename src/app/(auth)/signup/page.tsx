"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function SignupPage() {
  const router = useRouter();
  const supabase = createClient();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: `${location.origin}/dashboard`,
      },
    });

    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    router.push("/verify-email");
  }

  async function handleGoogleSignup() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${location.origin}/dashboard` },
    });
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-hero-gradient px-4">
      <div className="card w-full max-w-md">
        <h1 className="font-display text-2xl font-bold text-navy">Create your account</h1>
        <p className="mt-1 text-sm text-navy/60">Start learning for ₹999.</p>

        <form onSubmit={handleSignup} className="mt-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-navy">Full name</label>
            <input
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="mt-1 w-full rounded-lg border border-navy/10 px-4 py-2.5 outline-none focus:border-royal focus:ring-2 focus:ring-royal/20"
            />
          </div>
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
          <div>
            <label className="text-sm font-medium text-navy">Password</label>
            <input
              required
              type="password"
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-lg border border-navy/10 px-4 py-2.5 outline-none focus:border-royal focus:ring-2 focus:ring-royal/20"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? "Creating account…" : "Create account"}
          </button>
        </form>

        <div className="my-4 flex items-center gap-3 text-xs text-navy/40">
          <span className="h-px flex-1 bg-navy/10" /> OR <span className="h-px flex-1 bg-navy/10" />
        </div>

        <button onClick={handleGoogleSignup} className="btn-secondary w-full">
          Continue with Google
        </button>

        <p className="mt-6 text-center text-sm text-navy/60">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-royal">
            Log in
          </Link>
        </p>
      </div>
    </main>
  );
}
