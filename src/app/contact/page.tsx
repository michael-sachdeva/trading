export default function ContactPage() {
  return (
    <main className="mx-auto max-w-xl px-6 py-16 text-center">
      <h1 className="font-display text-3xl font-bold text-navy">Contact Us</h1>
      <p className="mt-3 text-navy/60">
        Have a question? Reach out and our team will respond within one business day.
      </p>
      <a href="mailto:support@yourdomain.com" className="btn-primary mt-6 inline-flex">
        support@yourdomain.com
      </a>
    </main>
  );
}