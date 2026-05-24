'use client';

import { useEffect } from 'react';

interface Props {
  timeRemaining: number;
  onTick: () => void;
  onTimeUp: () => void;
}

export default function Timer({ timeRemaining, onTick, onTimeUp }: Props) {
  useEffect(() => {
    if (timeRemaining <= 0) {
      onTimeUp();
      return;
    }
    const timer = setInterval(onTick, 1000);
    return () => clearInterval(timer);
  }, [timeRemaining, onTick, onTimeUp]);

  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  const isLow = timeRemaining < 300;

  return (
    <div className={`text-center font-mono text-lg font-bold ${isLow ? 'text-red-600' : 'text-gray-700'}`}>
      {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
    </div>
  );
}
