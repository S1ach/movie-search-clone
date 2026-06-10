'use client';

import { useMemo } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { SlidersHorizontal, X } from 'lucide-react';
import type { Ticket, TicketFilters } from '@/entities/ticket';
import { Button } from '@/shared/ui/button';
import { PriceRangeFilter } from './price-range-filter';
import { AirlineFilter } from './airline-filter';
import { StopsFilter } from './stops-filter';
import { DepartureTimeFilter } from './departure-time-filter';

interface TicketsFiltersProps {
  tickets: Ticket[];
  filters: TicketFilters;
  onPriceChange: (min: number | null, max: number | null) => void;
  onAirlineToggle: (airline: string) => void;
  onStopsChange: (maxStops: number | null) => void;
  onDepartureTimeChange: (from: string | null, to: string | null) => void;
  onReset: () => void;
}

export function TicketsFilters({
  tickets,
  filters,
  onPriceChange,
  onAirlineToggle,
  onStopsChange,
  onDepartureTimeChange,
  onReset,
}: TicketsFiltersProps) {
  const availableAirlines = useMemo(() => {
    const set = new Set(tickets.map((t) => t.airline));
    return Array.from(set).sort();
  }, [tickets]);

  const priceRange = useMemo(() => {
    if (tickets.length === 0) return { min: 0, max: 100000 };
    const prices = tickets.map((t) => t.price);
    return { min: Math.min(...prices), max: Math.max(...prices) };
  }, [tickets]);

  const hasActiveFilters =
    filters.minPrice !== null ||
    filters.maxPrice !== null ||
    filters.airlines.length > 0 ||
    filters.maxStops !== null ||
    filters.departureTimeFrom !== null ||
    filters.departureTimeTo !== null;

  const filterContent = (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-slate-800">Фильтры</h3>
        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="text-xs text-blue-600 hover:text-blue-800 font-medium transition-colors"
          >
            Сбросить
          </button>
        )}
      </div>

      <PriceRangeFilter
        min={priceRange.min}
        max={priceRange.max}
        currentMin={filters.minPrice}
        currentMax={filters.maxPrice}
        onChange={onPriceChange}
      />

      <hr className="border-slate-100" />

      <StopsFilter
        value={filters.maxStops}
        onChange={onStopsChange}
      />

      <hr className="border-slate-100" />

      <AirlineFilter
        airlines={availableAirlines}
        selected={filters.airlines}
        onToggle={onAirlineToggle}
      />

      <hr className="border-slate-100" />

      <DepartureTimeFilter
        from={filters.departureTimeFrom}
        to={filters.departureTimeTo}
        onChange={onDepartureTimeChange}
      />
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-[280px] flex-shrink-0">
        <div className="sticky top-6 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          {filterContent}
        </div>
      </aside>

      {/* Mobile drawer */}
      <div className="lg:hidden">
        <Dialog.Root>
          <Dialog.Trigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <SlidersHorizontal className="h-4 w-4" />
              Фильтры
              {hasActiveFilters && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[10px] text-white font-bold">
                  !
                </span>
              )}
            </Button>
          </Dialog.Trigger>

          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
            <Dialog.Content className="fixed inset-y-0 right-0 z-50 w-full max-w-sm bg-white shadow-2xl p-6 overflow-y-auto data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right">
              <div className="flex items-center justify-between mb-6">
                <Dialog.Title className="text-lg font-semibold text-slate-800">
                  Фильтры
                </Dialog.Title>
                <Dialog.Close asChild>
                  <button className="rounded-full p-2 hover:bg-slate-100 transition-colors">
                    <X className="h-5 w-5 text-slate-500" />
                  </button>
                </Dialog.Close>
              </div>
              {filterContent}
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </div>
    </>
  );
}
