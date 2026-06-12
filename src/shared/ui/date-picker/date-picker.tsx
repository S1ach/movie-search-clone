'use client';

import { useState, useMemo } from 'react';
import * as Popover from '@radix-ui/react-popover';
import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, addMonths, subMonths, isSameMonth, isSameDay, isToday, isBefore } from 'date-fns';
import { ru } from 'date-fns/locale';

interface DatePickerProps {
  value?: string; // YYYY-MM-DD
  onChange?: (value: string) => void;
  label?: string;
  error?: string;
  placeholder?: string;
  minDate?: Date;
}

const WEEKDAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

export function DatePicker({
  value,
  onChange,
  label,
  error,
  placeholder = 'Выберите дату',
  minDate,
}: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const selectedDate = value ? new Date(value + 'T00:00:00') : null;
  const [viewMonth, setViewMonth] = useState(
    selectedDate || new Date()
  );

  const effectiveMinDate = minDate || new Date(new Date().setHours(0, 0, 0, 0));

  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(viewMonth);
    const monthEnd = endOfMonth(viewMonth);
    const calStart = startOfWeek(monthStart, { weekStartsOn: 1 });
    const calEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

    const days: Date[] = [];
    let day = calStart;
    while (day <= calEnd) {
      days.push(day);
      day = addDays(day, 1);
    }
    return days;
  }, [viewMonth]);

  const handleSelect = (date: Date) => {
    const formatted = format(date, 'yyyy-MM-dd');
    onChange?.(formatted);
    setOpen(false);
  };

  const displayValue = selectedDate
    ? format(selectedDate, 'd MMM yyyy', { locale: ru })
    : '';

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-medium text-slate-600 flex items-center gap-1.5">
          <CalendarDays className="h-3.5 w-3.5" />
          {label}
        </label>
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
              ${displayValue ? 'text-slate-900' : 'text-slate-400'}
            `}
          >
            <CalendarDays className="h-4 w-4 text-slate-400 flex-shrink-0" />
            <span className="flex-1">{displayValue || placeholder}</span>
          </button>
        </Popover.Trigger>

        <Popover.Portal>
          <Popover.Content
            className="
              z-50 w-[300px] rounded-xl border border-slate-200
              bg-white shadow-xl shadow-slate-200/50 p-4
              animate-in fade-in-0 zoom-in-95
            "
            sideOffset={4}
            align="start"
          >
            {/* Month navigation */}
            <div className="flex items-center justify-between mb-3">
              <button
                type="button"
                onClick={() => setViewMonth(subMonths(viewMonth, 1))}
                className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors text-slate-500"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="text-sm font-semibold text-slate-800 capitalize">
                {format(viewMonth, 'LLLL yyyy', { locale: ru })}
              </span>
              <button
                type="button"
                onClick={() => setViewMonth(addMonths(viewMonth, 1))}
                className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors text-slate-500"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            {/* Weekday headers */}
            <div className="grid grid-cols-7 gap-0 mb-1">
              {WEEKDAYS.map((day) => (
                <div
                  key={day}
                  className="text-center text-[11px] font-medium text-slate-400 py-1"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-0">
              {calendarDays.map((day, i) => {
                const inMonth = isSameMonth(day, viewMonth);
                const selected = selectedDate && isSameDay(day, selectedDate);
                const today = isToday(day);
                const disabled = isBefore(day, effectiveMinDate);

                return (
                  <button
                    key={i}
                    type="button"
                    disabled={disabled}
                    onClick={() => handleSelect(day)}
                    className={`
                      h-9 w-full rounded-lg text-sm transition-all duration-150
                      ${!inMonth ? 'text-slate-300' : ''}
                      ${inMonth && !selected && !disabled ? 'text-slate-700 hover:bg-blue-50 hover:text-blue-700' : ''}
                      ${selected ? 'bg-blue-600 text-white font-semibold hover:bg-blue-700' : ''}
                      ${today && !selected ? 'font-semibold text-blue-600' : ''}
                      ${disabled ? 'text-slate-200 cursor-not-allowed' : 'cursor-pointer'}
                    `}
                  >
                    {format(day, 'd')}
                  </button>
                );
              })}
            </div>
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
      {error && <p className="text-xs text-red-500 mt-0.5">{error}</p>}
    </div>
  );
}
