interface Props {
  score: number;
  total: number;
  timeUsed: number;
  weakChapters: { id: number; title: string }[];
}

export default function ExamResult({ score, total, timeUsed, weakChapters }: Props) {
  const pct = Math.round((score / total) * 100);
  const passed = pct >= 70;

  return (
    <div className="card max-w-2xl mx-auto text-center">
      <div className={`text-5xl mb-4 ${passed ? 'text-green-600' : 'text-red-500'}`}>
        {pct}%
      </div>
      <h2 className="text-2xl font-bold mb-2">
        {passed ? 'Great job!' : 'Keep practicing'}
      </h2>
      <p className="text-gray-600 mb-4">
        You answered {score} out of {total} questions correctly.{' '}
        {passed ? 'You are on track to pass the real exam.' : 'Review the weak areas below and try again.'}
      </p>
      <div className="text-sm text-gray-500 mb-6">
        Time used: {Math.floor(timeUsed / 60)} min {timeUsed % 60} sec
      </div>

      {weakChapters.length > 0 && (
        <div className="text-left bg-amber-50 rounded-lg p-4">
          <h3 className="font-semibold text-amber-800 mb-2">Areas to Review</h3>
          <ul className="space-y-1">
            {weakChapters.map((ch) => (
              <li key={ch.id} className="text-sm text-amber-700">
                &bull; {ch.title}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
