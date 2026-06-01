import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service',
};

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16 prose prose-gray">
      <h1>Terms of Service</h1>
      <p>Last updated: June 1, 2026</p>

      <h2>1. Acceptance of Terms</h2>
      <p>
        By accessing or using NotaryPrep CA (&quot;the Service&quot;), you agree to be bound by these Terms of Service.
        If you do not agree, please do not use the Service.
      </p>

      <h2>2. Description of Service</h2>
      <p>
        NotaryPrep CA provides online study materials, practice questions, and mock exams to help users prepare
        for the California notary public examination. The Service is for educational and informational purposes only.
      </p>

      <h2>3. User Accounts</h2>
      <p>
        You may need to create an account to access certain features. You are responsible for maintaining
        the confidentiality of your account credentials and for all activities under your account.
      </p>

      <h2>4. Payments and Subscriptions</h2>
      <p>
        Certain features of the Service may require payment. All payments are processed securely through
        Paddle, our authorized payment processor. By making a purchase, you agree to Paddle&apos;s terms.
        Prices are subject to change with notice.
      </p>

      <h2>5. Intellectual Property</h2>
      <p>
        All content on the Service, including text, graphics, logos, and software, is the property of
        NotaryPrep CA and is protected by copyright and other intellectual property laws.
      </p>

      <h2>6. Limitation of Liability</h2>
      <p>
        The Service is provided &quot;as is&quot; without warranties of any kind. NotaryPrep CA is not liable for
        any damages arising from your use of the Service. Passing our practice exams does not guarantee
        success on the actual California notary public examination.
      </p>

      <h2>7. Contact</h2>
      <p>
        For questions about these Terms, contact us at: support@notaryprepca.com
      </p>
    </div>
  );
}
