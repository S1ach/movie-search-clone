'use client';

import { Armchair } from 'lucide-react';

interface ServiceClassOption {
  value: string;
  label: string;
}

const OPTIONS: ServiceClassOption[] = [
  { value: 'economy', label: 'Эконом' },
  { value: 'comfort', label: 'Комфорт' },
  { value: 'business', label: 'Бизнес' },
  { value: 'first', label: 'Первый' },
];

interface ServiceClassSelectorProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  error?: string;
}

export function ServiceClassSelector({
  value,
  onChange,
  label,
  error,
}: ServiceClassSelectorProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-medium text-slate-600 flex items-center gap-1.5">
          <Armchair className="h-3.5 w-3.5" />
          {label}
        </label>
      )}

      <div
        className={`
          flex rounded-xl border bg-slate-50 p-0.5 gap-1 h-[42px] items-center overflow-hidden
          ${error ? 'border-red-400' : 'border-slate-200'}
        `}
      >
        {OPTIONS.map((option) => {
          const isActive = value === option.value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              className={`
                flex-1 rounded-[10px] h-full px-2 text-[11px] sm:text-xs font-medium
                transition-all duration-200 whitespace-nowrap
                ${
                  isActive
                    ? 'bg-white text-blue-700 shadow-sm border border-slate-200'
                    : 'text-slate-500 hover:text-slate-700 border border-transparent'
                }
              `}
            >
              {option.label}
            </button>
          );
        })}
      </div>
      {error && <p className="text-xs text-red-500 mt-0.5">{error}</p>}
    </div>
  );
}
