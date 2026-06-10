'use client';

import { Select } from '@/shared/ui/select';
import type { SortOption } from '@/entities/ticket';

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'price_asc', label: 'Сначала дешёвые' },
  { value: 'duration_asc', label: 'Сначала быстрые' },
  { value: 'optimal', label: 'Оптимальные' },
];

interface SortTicketsSelectProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
}

export function SortTicketsSelect({ value, onChange }: SortTicketsSelectProps) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-slate-500 font-medium whitespace-nowrap">
        Сортировка:
      </span>
      <Select
        options={SORT_OPTIONS}
        value={value}
        onValueChange={(v) => onChange(v as SortOption)}
      />
    </div>
  );
}
