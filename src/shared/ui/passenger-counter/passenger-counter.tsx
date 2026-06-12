'use client';

import { Minus, Plus, Users } from 'lucide-react';

interface PassengerCounterProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  label?: string;
  error?: string;
}

export function PassengerCounter({
  value,
  onChange,
  min = 1,
  max = 9,
  label,
  error,
}: PassengerCounterProps) {
  const decrement = () => {
    if (value > min) onChange(value - 1);
  };

  const increment = () => {
    if (value < max) onChange(value + 1);
  };

  const getPassengerWord = (count: number): string => {
    const mod10 = count % 10;
    const mod100 = count % 100;
    if (mod100 >= 11 && mod100 <= 14) return 'пассажиров';
    if (mod10 === 1) return 'пассажир';
    if (mod10 >= 2 && mod10 <= 4) return 'пассажира';
    return 'пассажиров';
  };

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-medium text-slate-600 flex items-center gap-1.5">
          <Users className="h-3.5 w-3.5" />
          {label}
        </label>
      )}

      <div
        className={`
          flex items-center justify-between rounded-xl border
          bg-white px-3 h-[42px]
          transition-all duration-200
          ${error ? 'border-red-400' : 'border-slate-200'}
        `}
      >
        <button
          type="button"
          onClick={decrement}
          disabled={value <= min}
          className="
            flex items-center justify-center h-7 w-7 rounded-lg
            text-slate-500 transition-all duration-150
            hover:bg-blue-50 hover:text-blue-600
            disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-slate-500 disabled:cursor-not-allowed
          "
          aria-label="Уменьшить"
        >
          <Minus className="h-4 w-4" />
        </button>

        <span className="text-sm font-semibold text-slate-800 whitespace-nowrap">
          {value} пасс.
        </span>

        <button
          type="button"
          onClick={increment}
          disabled={value >= max}
          className="
            flex items-center justify-center h-7 w-7 rounded-lg
            text-slate-500 transition-all duration-150
            hover:bg-blue-50 hover:text-blue-600
            disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-slate-500 disabled:cursor-not-allowed
          "
          aria-label="Увеличить"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
      {error && <p className="text-xs text-red-500 mt-0.5">{error}</p>}
    </div>
  );
}
