'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import * as Popover from '@radix-ui/react-popover';
import { MapPin, Check, Search } from 'lucide-react';

interface CityOption {
  value: string;
  label: string;
}

interface CityAutocompleteProps {
  options: CityOption[];
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
}

export function CityAutocomplete({
  options,
  value,
  onValueChange,
  placeholder = 'Город или аэропорт',
  label,
  error,
}: CityAutocompleteProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const selectedLabel = options.find((o) => o.value === value)?.label || '';

  const filtered = useMemo(() => {
    if (!query) return options;
    const q = query.toLowerCase();
    return options.filter((o) => o.label.toLowerCase().includes(q));
  }, [options, query]);

  useEffect(() => {
    if (open) {
      setQuery('');
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  const handleSelect = (val: string) => {
    onValueChange?.(val);
    setOpen(false);
  };

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <span className="text-sm font-medium text-slate-600">{label}</span>
      )}
      <Popover.Root open={open} onOpenChange={setOpen}>
        <Popover.Trigger asChild>
          <button
            type="button"
            className={`
              w-full inline-flex items-center gap-2 rounded-xl border
              bg-white px-4 py-2.5 text-sm text-left
              transition-all duration-200
              hover:border-slate-300
              focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20
              ${error ? 'border-red-400' : 'border-slate-200'}
              ${value ? 'text-slate-900' : 'text-slate-400'}
            `}
          >
            <MapPin className="h-4 w-4 text-slate-400 flex-shrink-0" />
            <span className="flex-1 truncate">
              {selectedLabel || placeholder}
            </span>
          </button>
        </Popover.Trigger>

        <Popover.Portal>
          <Popover.Content
            className="
              z-50 w-[var(--radix-popover-trigger-width)] rounded-xl border border-slate-200
              bg-white shadow-xl shadow-slate-200/50 overflow-hidden
              animate-in fade-in-0 zoom-in-95
            "
            sideOffset={4}
            align="start"
          >
            {/* Search input */}
            <div className="flex items-center gap-2 px-3 py-2.5 border-b border-slate-100">
              <Search className="h-4 w-4 text-slate-400 flex-shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Поиск города..."
                className="
                  flex-1 text-sm text-slate-900 placeholder:text-slate-400
                  bg-transparent outline-none
                "
              />
            </div>

            {/* Options list */}
            <div className="max-h-[240px] overflow-y-auto p-1.5">
              {filtered.length === 0 ? (
                <p className="text-sm text-slate-400 text-center py-4">
                  Ничего не найдено
                </p>
              ) : (
                filtered.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleSelect(option.value)}
                    className={`
                      w-full flex items-center justify-between rounded-lg px-3 py-2
                      text-sm text-left transition-colors
                      hover:bg-blue-50 hover:text-blue-700
                      ${value === option.value ? 'bg-blue-50 text-blue-700 font-medium' : 'text-slate-700'}
                    `}
                  >
                    <span>{option.label}</span>
                    {value === option.value && (
                      <Check className="h-4 w-4 text-blue-600 flex-shrink-0" />
                    )}
                  </button>
                ))
              )}
            </div>
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
      {error && <p className="text-xs text-red-500 mt-0.5">{error}</p>}
    </div>
  );
}
