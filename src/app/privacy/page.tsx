export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16 prose prose-sm">
      <h1>Privacy Policy</h1>
      <p>Last updated: {new Date().toLocaleDateString("en-IN")}</p>
      <h2>Information We Collect</h2>
      <p>
        We collect your name, email, and payment details (processed securely via Razorpay — we
        do not store your card details) when you create an account and purchase a plan.
      </p>
      <h2>How We Use Your Information</h2>
      <ul>
        <li>To provide access to purchased courses</li>
        <li>To send transactional emails (purchase confirmations, password resets)</li>
        <li>To track your learning progress within your account</li>
      </ul>
      <h2>Data Sharing</h2>
      <p>
        We do not sell your personal data. We share data only with service providers necessary
        to operate the Platform (e.g. Supabase for hosting, Razorpay for payments).
      </p>
      <h2>Your Rights</h2>
      <p>
        You may request access to, correction of, or deletion of your personal data by
        contacting us via the Contact page.
      </p>
      <h2>Cookies</h2>
      <p>We use essential cookies to keep you logged in and maintain your session securely.</p>
    </main>
  );
}