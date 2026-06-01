import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Refund Policy',
};

export default function RefundPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16 prose prose-gray">
      <h1>Refund Policy</h1>
      <p>Last updated: June 1, 2026</p>

      <h2>1. Digital Products</h2>
      <p>
        NotaryPrep CA sells digital products (study guides, practice exams, and subscriptions).
        Due to the nature of digital goods, which are immediately accessible upon purchase,
        our refund policy is as follows:
      </p>

      <h2>2. Refund Eligibility</h2>
      <p>You may request a refund within 7 days of purchase if:</p>
      <ul>
        <li>You have not accessed or consumed a significant portion of the purchased content.</li>
        <li>The product is materially different from its description.</li>
        <li>You experienced a technical issue that prevented access, and we were unable to resolve it.</li>
      </ul>

      <h2>3. How to Request a Refund</h2>
      <p>
        To request a refund, email support@notaryprepca.com with your order details and reason for the request.
        We will review and respond within 3 business days.
      </p>

      <h2>4. Subscription Cancellation</h2>
      <p>
        You may cancel your subscription at any time. Cancellation takes effect at the end of the current
        billing period. No partial refunds are provided for unused portions of the billing period.
      </p>

      <h2>5. Contact</h2>
      <p>
        For refund inquiries: support@notaryprepca.com
      </p>
    </div>
  );
}
