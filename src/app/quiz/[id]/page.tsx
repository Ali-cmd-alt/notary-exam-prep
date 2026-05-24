'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import QuestionCard from '@/components/QuestionCard';
import Link from 'next/link';
import type { Question } from '@/types';

export default function QuizPage() {
  const { id } = useParams<{ id: string }>();
  const chapterId = parseInt(id);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Map<number, number>>(new Map());
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    supabase
      .from('questions')
      .select('*')
      .eq('chapter_id', chapterId)
      .order('id')
      .then(({ data }) => {
        setQuestions((data || []) as Question[]);
        setLoading(false);
      });
  }, [chapterId]);

  const handleAnswer = (questionId: number, selectedIndex: number) => {
    setAnswers((prev) => new Map(prev).set(questionId, selectedIndex));
  };

  const correctCount = questions.filter((q) => answers.get(q.id) === q.correct_index).length;

  const handleSubmit = async () => {
    setSubmitted(true);
    setSaving(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      for (const q of questions) {
        const userAnswer = answers.get(q.id);
        if (userAnswer !== undefined && userAnswer !== q.correct_index) {
          await supabase.from('user_wrong_answers').upsert(
            { user_id: user.id, question_id: q.id, user_answer: userAnswer, review_count: 0, last_reviewed_at: new Date().toISOString() },
            { onConflict: 'user_id,question_id' }
          );
        }
      }
      const { data: existing } = await supabase.from('user_progress').select('quiz_scores').eq('user_id', user.id).eq('chapter_id', chapterId).maybeSingle();
      const existingScores = (existing as any)?.quiz_scores || [];
      const newScore = { date: new Date().toISOString(), score: correctCount, total: questions.length };
      await supabase.from('user_progress').upsert(
        { user_id: user.id, chapter_id: chapterId, quiz_scores: [...existingScores, newScore] },
        { onConflict: 'user_id,chapter_id' }
      );
    }
    setSaving(false);
  };

  if (loading) {
    return <div className="max-w-2xl mx-auto px-4 py-12 text-center text-gray-500">Loading questions...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <Link href={`/chapter/${chapterId}`} className="text-sm text-blue-600 hover:underline mb-4 inline-block">
        &larr; Back to Chapter
      </Link>
      <h1 className="text-2xl font-bold mb-6">Chapter {chapterId} Quiz</h1>

      {submitted && (
        <div className="card mb-6 bg-blue-50 border-blue-200">
          <p className="text-lg font-bold text-blue-800">
            Score: {correctCount} / {questions.length} ({Math.round((correctCount / questions.length) * 100)}%)
          </p>
          {saving && <p className="text-sm text-blue-600 mt-1">Saving your results...</p>}
        </div>
      )}

      <div className="space-y-6">
        {questions.map((q, idx) => (
          <div key={q.id}>
            <p className="text-xs text-gray-400 mb-2 font-medium">Question {idx + 1} of {questions.length}</p>
            <QuestionCard
              question={q}
              onAnswer={handleAnswer}
              showResult={submitted}
              userAnswer={answers.get(q.id)}
            />
          </div>
        ))}
      </div>

      {!submitted && questions.length > 0 && (
        <div className="mt-8 text-center">
          <button
            onClick={handleSubmit}
            disabled={answers.size < questions.length}
            className="btn-primary"
          >
            Submit Answers ({answers.size}/{questions.length} answered)
          </button>
        </div>
      )}

      {submitted && (
        <div className="mt-8 flex justify-center gap-4">
          <button onClick={() => { setSubmitted(false); setAnswers(new Map()); }} className="btn-secondary">
            Retry Quiz
          </button>
          <Link href="/chapters" className="btn-primary">
            Back to Chapters
          </Link>
        </div>
      )}
    </div>
  );
}
