'use client';

import { useState } from 'react';
import type { Question } from '@/types';

interface Props {
  question: Question;
  onAnswer: (questionId: number, selectedIndex: number) => void;
  showResult: boolean;
  userAnswer?: number;
}

export default function QuestionCard({ question, onAnswer, showResult, userAnswer }: Props) {
  const [selected, setSelected] = useState<number | null>(userAnswer ?? null);
  const isCorrect = selected === question.correct_index;
  const isWrong = selected !== null && selected !== question.correct_index;

  const handleSelect = (idx: number) => {
    if (showResult) return;
    setSelected(idx);
    onAnswer(question.id, idx);
  };

  const optionLabels = ['A', 'B', 'C', 'D'];

  return (
    <div className="card">
      <p className="font-medium text-lg mb-4">{question.question}</p>
      <div className="space-y-2">
        {question.options.map((opt, idx) => {
          let borderClass = 'border-gray-200 hover:border-blue-300';
          if (showResult && idx === question.correct_index) {
            borderClass = 'border-green-400 bg-green-50';
          } else if (showResult && idx === selected && isWrong) {
            borderClass = 'border-red-400 bg-red-50';
          } else if (selected === idx) {
            borderClass = 'border-blue-400 bg-blue-50';
          }

          return (
            <button
              key={idx}
              onClick={() => handleSelect(idx)}
              disabled={showResult}
              className={`w-full text-left border rounded-lg px-4 py-3 flex items-start gap-3 transition-colors ${borderClass}`}
            >
              <span className="font-mono text-sm font-bold text-gray-400 mt-0.5">
                {optionLabels[idx]}
              </span>
              <span className="text-sm">{opt}</span>
            </button>
          );
        })}
      </div>
      {showResult && (
        <div className={`mt-4 p-4 rounded-lg ${isCorrect ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
          <p className="text-sm font-semibold mb-1">
            {isCorrect ? 'Correct!' : `Incorrect. The correct answer is ${optionLabels[question.correct_index]}.`}
          </p>
          <p className="text-sm">{question.explanation}</p>
        </div>
      )}
    </div>
  );
}
