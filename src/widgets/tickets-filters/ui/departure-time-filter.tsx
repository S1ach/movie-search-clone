'use client';

interface DepartureTimeFilterProps {
  from: string | null;
  to: string | null;
  onChange: (from: string | null, to: string | null) => void;
}

const TIME_SLOTS = [
  { label: 'Утро (06–12)', from: '06:00', to: '12:00', icon: '🌅' },
  { label: 'День (12–18)', from: '12:00', to: '18:00', icon: '☀️' },
  { label: 'Вечер (18–00)', from: '18:00', to: '00:00', icon: '🌆' },
  { label: 'Ночь (00–06)', from: '00:00', to: '06:00', icon: '🌙' },
] as const;

export function DepartureTimeFilter({
  from,
  to,
  onChange,
}: DepartureTimeFilterProps) {
  const isActive = (slot: typeof TIME_SLOTS[number]) =>
    from === slot.from && to === slot.to;

  return (
    <div>
      <h4 className="text-sm font-medium text-slate-700 mb-3">Время вылета</h4>
      <div className="grid grid-cols-2 gap-2">
        {TIME_SLOTS.map((slot) => (
          <button
            key={slot.label}
            onClick={() => {
              if (isActive(slot)) {
                onChange(null, null);
              } else {
                onChange(slot.from, slot.to);
              }
            }}
            className={`
              flex flex-col items-center gap-1 px-3 py-2.5 rounded-xl text-xs
              border transition-all duration-150
              ${
                isActive(slot)
                  ? 'border-blue-300 bg-blue-50 text-blue-700 font-medium'
                  : 'border-slate-150 text-slate-500 hover:border-slate-300 hover:bg-slate-50'
              }
            `}
          >
            <span className="text-base">{slot.icon}</span>
            <span>{slot.label}</span>
          </button>
        ))}
      </div>
      {from !== null && (
        <button
          onClick={() => onChange(null, null)}
          className="mt-2 text-xs text-blue-600 hover:text-blue-800 transition-colors"
        >
          Сбросить
        </button>
      )}
    </div>
  );
}
