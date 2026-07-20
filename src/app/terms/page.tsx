export default function TermsPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16 prose prose-sm">
      <h1>Terms of Service</h1>
      <p>Last updated: {new Date().toLocaleDateString("en-IN")}</p>
      <p>
        By accessing or using TradeMaster AI Academy ("the Platform"), you agree to be bound by
        these Terms of Service.
      </p>
      <h2>1. Educational Purpose Only</h2>
      <p>
        All content on the Platform is provided for educational purposes only. Nothing on this
        Platform constitutes financial, investment, or trading advice. Trading in securities,
        derivatives, forex, and commodities involves substantial risk of loss.
      </p>
      <h2>2. Account & Access</h2>
      <p>
        You are responsible for maintaining the confidentiality of your account credentials.
        Course access is granted per the plan purchased and is non-transferable.
      </p>
      <h2>3. Payments</h2>
      <p>
        All payments are processed securely via Razorpay. Prices are listed in Indian Rupees
        (INR) and are inclusive of applicable taxes unless stated otherwise.
      </p>
      <h2>4. Intellectual Property</h2>
      <p>
        All videos, notes, and materials on the Platform are the property of TradeMaster AI
        Academy and may not be reproduced, redistributed, or resold.
      </p>
      <h2>5. Limitation of Liability</h2>
      <p>
        TradeMaster AI Academy is not liable for any trading losses incurred as a result of
        applying concepts taught on the Platform.
      </p>
      <h2>6. Contact</h2>
      <p>For questions about these terms, contact us via the Contact page.</p>
    </main>
  );
}