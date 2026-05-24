'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import QuestionCard from '@/components/QuestionCard';
import type { WrongAnswer, ExamRecord, Question } from '@/types';

export default function HistoryPage() {
  const [wrongAnswers, setWrongAnswers] = useState<(WrongAnswer & { questions?: Question })[]>([]);
  const [examRecords, setExamRecords] = useState<ExamRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.push('/login?redirect=/history');
        return;
      }
      loadData(data.user.id);
    });
  }, []);

  const loadData = async (userId: string) => {
    const [{ data: wrong }, { data: exams }] = await Promise.all([
      supabase.from('user_wrong_answers').select('*, questions(*)').eq('user_id', userId).order('last_reviewed_at', { ascending: false }),
      supabase.from('exam_records').select('*').eq('user_id', userId).order('taken_at', { ascending: false }),
    ]);
    setWrongAnswers((wrong || []) as any[]);
    setExamRecords((exams || []) as ExamRecord[]);
    setLoading(false);
  };

  const handleReviewAnswer = async (qId: number, idx: number) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from('user_wrong_answers').update({
      user_answer: idx,
      review_count: (wrongAnswers.find((w) => w.question_id === qId)?.review_count || 0) + 1,
      last_reviewed_at: new Date().toISOString(),
    }).eq('user_id', user.id).eq('question_id', qId);
    loadData(user.id);
  };

  if (loading) {
    return <div className="max-w-2xl mx-auto px-4 py-12 text-center text-gray-500">Loading...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">My Progress</h1>

      {/* Exam History */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4">Exam History</h2>
        {examRecords.length === 0 ? (
          <p className="text-gray-500 text-sm">No exams taken yet.</p>
        ) : (
          <div className="space-y-3">
            {examRecords.map((er) => {
              const pct = Math.round((er.score / er.total) * 100);
              return (
                <div key={er.id} className="card flex justify-between items-center">
                  <div>
                    <span className={`font-bold text-lg ${pct >= 70 ? 'text-green-600' : 'text-red-500'}`}>{pct}%</span>
                    <span className="text-gray-500 text-sm ml-2">
                      {er.score}/{er.total} correct
                    </span>
                  </div>
                  <div className="text-sm text-gray-400">
                    {new Date(er.taken_at).toLocaleDateString()} &middot; {Math.floor(er.time_used / 60)}m {er.time_used % 60}s
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Wrong Answers */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Wrong Answer Review ({wrongAnswers.length})</h2>
        {wrongAnswers.length === 0 ? (
          <p className="text-gray-500 text-sm">No wrong answers yet. Keep practicing!</p>
        ) : (
          <div className="space-y-4">
            {wrongAnswers.map((wa) => (
              <div key={wa.id} className="card">
                {wa.questions && (
                  <>
                    <div className="text-xs text-gray-400 mb-2">
                      Reviewed {wa.review_count} time{wa.review_count !== 1 ? 's' : ''} &middot; Chapter {wa.questions.chapter_id}
                    </div>
                    <p className="font-medium text-sm mb-3">{wa.questions.question}</p>
                    <QuestionCard
                      question={wa.questions}
                      onAnswer={(qId, idx) => handleReviewAnswer(qId, idx)}
                      showResult={true}
                      userAnswer={wa.user_answer}
                    />
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
