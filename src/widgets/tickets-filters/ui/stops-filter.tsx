'use client';

interface StopsFilterProps {
  value: number | null;
  onChange: (maxStops: number | null) => void;
}

const OPTIONS = [
  { label: 'Любые', value: null },
  { label: 'Без пересадок', value: 0 },
  { label: 'До 1 пересадки', value: 1 },
  { label: 'До 2 пересадок', value: 2 },
] as const;

export function StopsFilter({ value, onChange }: StopsFilterProps) {
  return (
    <div>
      <h4 className="text-sm font-medium text-slate-700 mb-3">Пересадки</h4>
      <div className="space-y-1.5">
        {OPTIONS.map((option) => (
          <button
            key={option.label}
            onClick={() => onChange(option.value)}
            className={`
              w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-150
              ${
                value === option.value
                  ? 'bg-blue-50 text-blue-700 font-medium'
                  : 'text-slate-600 hover:bg-slate-50'
              }
            `}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
