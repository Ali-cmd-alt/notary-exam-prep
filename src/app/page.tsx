// src/app/page.tsx
import Link from 'next/link';
import { createServerSupabase } from '@/lib/supabase/server';
import ReviewStars from '@/components/ReviewStars';

export default async function HomePage() {
  const supabase = await createServerSupabase();

  const { data: reviews } = await supabase
    .from('reviews')
    .select('id, rating, comment, created_at, profiles(display_name)')
    .order('created_at', { ascending: false })
    .limit(3);

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-20 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
            Pass Your California Notary Exam
          </h1>
          <p className="text-lg text-gray-600 mb-8 leading-relaxed">
            Free study guides, practice questions, and mock exams based on the latest California
            Secretary of State handbook. Start studying in minutes—no account required for the first
            two chapters.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/chapters" className="btn-primary text-lg px-8 py-4">
              Start Studying Free
            </Link>
            <Link href="/pricing" className="btn-secondary text-lg px-8 py-4">
              View Pricing
            </Link>
          </div>
          <p className="mt-4 text-sm text-gray-400">
            First 2 chapters free. Full access from $14.99.
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-12">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: '1. Study the Material',
              desc: 'Read concise knowledge cards organized into 7 chapters. Each card cites the official CA handbook so you know the source.',
            },
            {
              title: '2. Practice by Chapter',
              desc: 'Test your understanding with 10-15 multiple-choice questions per chapter. Instant feedback and explanations for every answer.',
            },
            {
              title: '3. Take a Mock Exam',
              desc: 'Simulate the real test: 30 random questions, 45-minute timer, and a detailed score report showing your weak areas.',
            },
          ].map((f) => (
            <div key={f.title} className="card text-center">
              <h3 className="font-bold text-lg mb-2">{f.title}</h3>
              <p className="text-gray-600 text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      {reviews && reviews.length > 0 && (
        <section className="bg-gray-50 py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-10">What Students Say</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {(reviews as any[]).map((r) => (
                <div key={r.id} className="card">
                  <ReviewStars rating={r.rating} />
                  <p className="text-gray-700 mt-3 text-sm leading-relaxed">
                    &ldquo;{r.comment}&rdquo;
                  </p>
                  <p className="text-xs text-gray-400 mt-3">
                    {r.profiles?.display_name || 'Student'}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-16 px-4 text-center">
        <h2 className="text-2xl font-bold mb-4">Ready to Get Your Notary Commission?</h2>
        <p className="text-gray-600 mb-6">
          Join students who prepared with NotaryPrep CA. Start free, upgrade when you are ready.
        </p>
        <Link href="/chapters" className="btn-primary text-lg px-8 py-4">
          Start Free Trial
        </Link>
      </section>
    </div>
  );
}
