import PaddleButton from '@/components/PaddleButton';
import Link from 'next/link';

export default function PricingPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold text-center mb-4">One-Time Purchase. Full Access.</h1>
      <p className="text-gray-600 text-center mb-12 max-w-lg mx-auto">
        Unlock everything with a single payment. No recurring fees. Study at your own pace.
      </p>

      <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
        {/* Free Tier */}
        <div className="card border-2 border-gray-200">
          <h2 className="text-xl font-bold mb-2">Free Trial</h2>
          <p className="text-3xl font-extrabold mb-4">$0</p>
          <ul className="space-y-2 text-sm text-gray-600 mb-6">
            <li>&#10003; First 2 chapters (full access)</li>
            <li>&#10003; Chapter 1 &amp; 2 quizzes</li>
            <li>&#10003; Blog articles</li>
            <li className="text-gray-400">&times; Full question bank</li>
            <li className="text-gray-400">&times; Practice exams</li>
            <li className="text-gray-400">&times; Progress tracking</li>
            <li className="text-gray-400">&times; Wrong answer review</li>
          </ul>
          <Link href="/chapters" className="btn-secondary block text-center w-full">
            Start Free
          </Link>
        </div>

        {/* Paid Tier */}
        <div className="card border-2 border-blue-500 relative">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs px-3 py-1 rounded-full font-medium">
            Most Popular
          </div>
          <h2 className="text-xl font-bold mb-2">Full Access</h2>
          <p className="text-3xl font-extrabold mb-1">$14.99</p>
          <p className="text-xs text-gray-400 mb-4">One-time payment</p>
          <ul className="space-y-2 text-sm text-gray-600 mb-6">
            <li>&#10003; All 7 chapters unlocked</li>
            <li>&#10003; Full question bank (~100 questions)</li>
            <li>&#10003; Unlimited practice exams</li>
            <li>&#10003; Progress tracking</li>
            <li>&#10003; Wrong answer review</li>
            <li>&#10003; Exam score history</li>
            <li>&#10003; Lifetime access</li>
          </ul>
          <PaddleButton />
        </div>
      </div>
    </div>
  );
}
