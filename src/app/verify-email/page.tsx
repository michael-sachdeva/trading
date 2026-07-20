export default function VerifyEmailPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-hero-gradient px-4">
      <div className="card w-full max-w-md text-center">
        <h1 className="font-display text-2xl font-bold text-navy">Check your email</h1>
        <p className="mt-3 text-sm text-navy/60">
          We've sent a confirmation link to your email address. Click it to activate your
          account, then log in.
        </p>
        <a href="/login" className="btn-primary mt-6 inline-flex">
          Go to login
        </a>
      </div>
    </main>
  );
}