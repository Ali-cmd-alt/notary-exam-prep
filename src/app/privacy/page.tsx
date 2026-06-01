import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
};

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16 prose prose-gray">
      <h1>Privacy Policy</h1>
      <p>Last updated: June 1, 2026</p>

      <h2>1. Information We Collect</h2>
      <p>
        When you use NotaryPrep CA, we may collect:
      </p>
      <ul>
        <li><strong>Account information:</strong> email address and name when you sign up.</li>
        <li><strong>Usage data:</strong> pages visited, quiz results, and study progress.</li>
        <li><strong>Payment information:</strong> processed by Paddle; we do not store your credit card details.</li>
      </ul>

      <h2>2. How We Use Your Information</h2>
      <p>
        We use your information to provide and improve the Service, process payments,
        communicate with you about your account, and send relevant updates (with your consent).
      </p>

      <h2>3. Data Sharing</h2>
      <p>
        We do not sell your personal data. We may share data with third-party service providers
        (such as Supabase for authentication and database, and Paddle for payment processing)
        solely for the purpose of operating the Service.
      </p>

      <h2>4. Data Security</h2>
      <p>
        We implement reasonable security measures to protect your personal information.
        However, no method of transmission over the Internet is 100% secure.
      </p>

      <h2>5. Your Rights</h2>
      <p>
        You may access, update, or delete your account information at any time.
        To request data deletion, contact us at support@notaryprepca.com.
      </p>

      <h2>6. Cookies</h2>
      <p>
        We use essential cookies for authentication and session management.
        We do not use tracking cookies for advertising purposes.
      </p>

      <h2>7. Contact</h2>
      <p>
        For privacy-related questions, contact: support@notaryprepca.com
      </p>
    </div>
  );
}
