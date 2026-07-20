export default function RefundPolicyPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16 prose prose-sm">
      <h1>Refund Policy</h1>
      <p>Last updated: {new Date().toLocaleDateString("en-IN")}</p>
      <p>
        Because our courses provide immediate digital access to video and written content, all
        purchases are generally non-refundable once course material has been accessed.
      </p>
      <h2>Eligibility for Refund</h2>
      <p>
        A refund may be considered within 7 days of purchase if less than 10% of the course
        content has been accessed, at our sole discretion.
      </p>
      <h2>How to Request</h2>
      <p>
        Contact us via the Contact page with your order ID and reason for the refund request.
        Approved refunds are processed to the original payment method within 5-7 business days.
      </p>
      <h2>Plan Upgrades</h2>
      <p>
        Plan upgrade payments (the difference charged when moving to a higher plan) follow the
        same refund eligibility as above.
      </p>
    </main>
  );
}