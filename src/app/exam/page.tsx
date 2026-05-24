'use client';

import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import QuestionCard from '@/components/QuestionCard';
import Timer from '@/components/Timer';
import ExamResult from '@/components/ExamResult';
import type { Question } from '@/types';

const EXAM_DURATION = 45 * 60;
const EXAM_SIZE = 30;

export default function ExamPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Map<number, number>>(new Map());
  const [timeRemaining, setTimeRemaining] = useState(EXAM_DURATION);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.push('/login?redirect=/exam');
        return;
      }
    });
    supabase.from('questions').select('*').then(({ data }) => {
      const all = (data || []) as Question[];
      const shuffled = all.sort(() => Math.random() - 0.5).slice(0, EXAM_SIZE);
      setQuestions(shuffled);
      setLoading(false);
    });
  }, []);

  const handleTimeUp = useCallback(() => {
    finishExam();
  }, [answers, questions]);

  const finishExam = async () => {
    setFinished(true);
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const correctCount = questions.filter((q) => answers.get(q.id) === q.correct_index).length;

    const chapterErrors = new Map<number, { wrong: number; total: number }>();
    questions.forEach((q) => {
      const entry = chapterErrors.get(q.chapter_id) || { wrong: 0, total: 0 };
      entry.total++;
      if (answers.get(q.id) !== q.correct_index) entry.wrong++;
      chapterErrors.set(q.chapter_id, entry);
    });

    const weakChapters: number[] = [];
    chapterErrors.forEach((v, chapterId) => {
      if (v.wrong / v.total > 0.4) weakChapters.push(chapterId);
    });

    const timeUsed = EXAM_DURATION - timeRemaining;

    await supabase.from('exam_records').insert({
      user_id: user.id,
      score: correctCount,
      total: questions.length,
      time_used: timeUsed,
      weak_chapters: weakChapters,
    });

    setSaving(false);
  };

  const handleAnswer = (questionId: number, selectedIndex: number) => {
    setAnswers((prev) => new Map(prev).set(questionId, selectedIndex));
  };

  const timeUsed = EXAM_DURATION - timeRemaining;
  const correctCount = questions.filter((q) => answers.get(q.id) === q.correct_index).length;

  if (loading) {
    return <div className="max-w-2xl mx-auto px-4 py-12 text-center text-gray-500">Preparing your exam...</div>;
  }

  if (!started) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl font-bold mb-4">Practice Exam</h1>
        <div className="card max-w-md mx-auto">
          <ul className="text-left text-sm text-gray-600 space-y-2 mb-6">
            <li>&bull; {EXAM_SIZE} random questions from all chapters</li>
            <li>&bull; {EXAM_DURATION / 60}-minute time limit</li>
            <li>&bull; Detailed score report at the end</li>
            <li>&bull; Results saved to your progress history</li>
          </ul>
          <button onClick={() => setStarted(true)} className="btn-primary w-full">
            Start Exam
          </button>
        </div>
      </div>
    );
  }

  if (finished) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <ExamResult
          score={correctCount}
          total={questions.length}
          timeUsed={timeUsed}
          weakChapters={[]}
        />
        {saving && <p className="text-center text-sm text-gray-500 mt-4">Saving result...</p>}
        <div className="text-center mt-6 flex gap-4 justify-center">
          <button onClick={() => { setAnswers(new Map()); setFinished(false); setStarted(false); setTimeRemaining(EXAM_DURATION); }} className="btn-secondary">
            New Exam
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6 sticky top-0 bg-white py-3 z-10 border-b">
        <h1 className="text-xl font-bold">Practice Exam</h1>
        <Timer
          timeRemaining={timeRemaining}
          onTick={() => setTimeRemaining((t) => t - 1)}
          onTimeUp={handleTimeUp}
        />
        <span className="text-sm text-gray-500">
          {answers.size}/{questions.length} answered
        </span>
      </div>

      <div className="space-y-8">
        {questions.map((q, idx) => (
          <div key={q.id}>
            <p className="text-xs text-gray-400 mb-2 font-medium">Question {idx + 1} of {questions.length}</p>
            <QuestionCard question={q} onAnswer={handleAnswer} showResult={false} userAnswer={answers.get(q.id)} />
          </div>
        ))}
      </div>

      <div className="text-center mt-8">
        <button onClick={finishExam} className="btn-primary">
          Submit Exam
        </button>
      </div>
    </div>
  );
}
