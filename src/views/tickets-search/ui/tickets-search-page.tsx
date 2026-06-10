'use client';

import { useState, useMemo, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/providers/hooks';
import { setSearchParams } from '@/features/search-tickets';
import {
  setPriceRange,
  toggleAirline,
  setMaxStops,
  setDepartureTime,
  resetFilters,
} from '@/features/filter-tickets';
import { SeatSelectionModal } from '@/features/seat-selection';
import type { Seat } from '@/features/seat-selection';
import { useLazySearchTicketsQuery } from '@/entities/ticket';
import type { Ticket, SortOption, TicketFilters } from '@/entities/ticket';
import type { SearchFormValues } from '@/widgets/tickets-search-form';
import { TicketsSearchForm } from '@/widgets/tickets-search-form';
import { TicketsResults } from '@/widgets/tickets-results';
import { TicketsFilters } from '@/widgets/tickets-filters';
import { toggleFavorite, setIsDrawerOpen, FavoritesDrawer } from '@/features/favorites';
import { BoardingPassModal } from '@/features/boarding-pass';

function applyFilters(tickets: Ticket[], filters: TicketFilters): Ticket[] {
  return tickets.filter((ticket) => {
    if (filters.minPrice !== null && ticket.price < filters.minPrice) return false;
    if (filters.maxPrice !== null && ticket.price > filters.maxPrice) return false;

    if (filters.maxStops !== null && ticket.stops > filters.maxStops) return false;

    if (filters.airlines.length > 0 && !filters.airlines.includes(ticket.airline)) {
      return false;
    }

    if (filters.departureTimeFrom !== null) {
      if (ticket.departureTime < filters.departureTimeFrom) return false;
    }
    if (filters.departureTimeTo !== null) {
      if (ticket.departureTime > filters.departureTimeTo) return false;
    }

    return true;
  });
}

function applySorting(tickets: Ticket[], sort: SortOption): Ticket[] {
  const sorted = [...tickets];

  switch (sort) {
    case 'price_asc':
      return sorted.sort((a, b) => a.price - b.price);
    case 'duration_asc':
      return sorted.sort((a, b) => a.durationMinutes - b.durationMinutes);
    case 'optimal':
      return sorted.sort((a, b) => {
        const scoreA = a.price * 0.5 + a.durationMinutes * 50;
        const scoreB = b.price * 0.5 + b.durationMinutes * 50;
        return scoreA - scoreB;
      });
    default:
      return sorted;
  }
}

export function TicketsSearchPage() {
  const dispatch = useAppDispatch();
  const { hasSearched, params: searchParams } = useAppSelector((s) => s.searchTickets);
  const filters = useAppSelector((s) => s.filterTickets);
  const favorites = useAppSelector((s) => s.favorites.items);
  const isDrawerOpen = useAppSelector((s) => s.favorites.isDrawerOpen);

  const [sortOption, setSortOption] = useState<SortOption>('price_asc');
  const [seatModalTicket, setSeatModalTicket] = useState<Ticket | null>(null);
  const [boardingPassData, setBoardingPassData] = useState<{ ticket: Ticket; seats: Seat[] } | null>(null);
  const [triggerSearch, { data, isLoading, isError }] =
    useLazySearchTicketsQuery();

  const allTickets = data?.tickets ?? [];

  const processedTickets = useMemo(() => {
    const filtered = applyFilters(allTickets, filters);
    return applySorting(filtered, sortOption);
  }, [allTickets, filters, sortOption]);

  const handleSearch = useCallback(
    (values: SearchFormValues) => {
      dispatch(
        setSearchParams({
          from: values.from,
          to: values.to,
          departureDate: values.departureDate,
          returnDate: values.returnDate || undefined,
          passengers: values.passengers,
          serviceClass: values.serviceClass as 'economy' | 'comfort' | 'business' | 'first',
        })
      );
      dispatch(resetFilters());
      triggerSearch({
        from: values.from,
        to: values.to,
        departureDate: values.departureDate,
        returnDate: values.returnDate || undefined,
        passengers: values.passengers,
        serviceClass: values.serviceClass as 'economy' | 'comfort' | 'business' | 'first',
      });
    },
    [dispatch, triggerSearch]
  );

  const handleRetry = useCallback(() => {
    triggerSearch({
      from: '',
      to: '',
      departureDate: '',
      passengers: 1,
      serviceClass: 'economy',
    });
  }, [triggerSearch]);

  const handleSelectTicket = useCallback((ticket: Ticket) => {
    setSeatModalTicket(ticket);
  }, []);

  const handleSeatConfirm = useCallback((ticket: Ticket, seats: Seat[]) => {
    setBoardingPassData({ ticket, seats });
    setSeatModalTicket(null);
  }, []);

  const handleRouteClick = useCallback(
    (fromCode: string, toCode: string) => {
      const today = new Date();
      const nextWeek = new Date(today);
      nextWeek.setDate(today.getDate() + 7);
      const departureDate = nextWeek.toISOString().split('T')[0];

      dispatch(
        setSearchParams({
          from: fromCode,
          to: toCode,
          departureDate,
          passengers: 1,
          serviceClass: 'economy',
        })
      );
      dispatch(resetFilters());
      triggerSearch({
        from: fromCode,
        to: toCode,
        departureDate,
        passengers: 1,
        serviceClass: 'economy',
      });
    },
    [dispatch, triggerSearch]
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50">
      {/* Hero search section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 pb-8 pt-10 sm:pt-14 sm:pb-12">
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-white/5 blur-3xl" />
          <div className="absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-blue-400/10 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-indigo-500/5 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-2">
              Найдите лучшие авиабилеты
            </h1>
            <p className="text-blue-200/80 text-sm sm:text-base">
              Сравните цены и выберите идеальный рейс
            </p>
          </div>

          <div className="mx-auto max-w-4xl">
            <TicketsSearchForm
              onSearch={handleSearch}
              isLoading={isLoading}
            />
          </div>
        </div>
      </section>

      {/* Results section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-6">
          {/* Filters: desktop sidebar + mobile drawer (handled internally) */}
          {hasSearched && allTickets.length > 0 && (
            <TicketsFilters
              tickets={allTickets}
              filters={filters}
              onPriceChange={(min, max) => dispatch(setPriceRange({ min, max }))}
              onAirlineToggle={(airline) => dispatch(toggleAirline(airline))}
              onStopsChange={(maxStops) => dispatch(setMaxStops(maxStops))}
              onDepartureTimeChange={(from, to) =>
                dispatch(setDepartureTime({ from, to }))
              }
              onReset={() => dispatch(resetFilters())}
            />
          )}

          {/* Main results */}
          <div className="flex-1 min-w-0">
            <TicketsResults
              tickets={processedTickets}
              isLoading={isLoading}
              isError={isError}
              hasSearched={hasSearched}
              sortOption={sortOption}
              onSortChange={setSortOption}
              onRetry={handleRetry}
              onSelectTicket={handleSelectTicket}
              onRouteClick={handleRouteClick}
              favorites={favorites}
              onToggleFavorite={(t) => dispatch(toggleFavorite(t))}
            />
          </div>
        </div>
      </section>

      {/* Seat selection modal */}
      {seatModalTicket && (
        <SeatSelectionModal
          ticket={seatModalTicket}
          passengers={searchParams.passengers}
          isOpen={!!seatModalTicket}
          onClose={() => setSeatModalTicket(null)}
          onConfirm={handleSeatConfirm}
        />
      )}

      {/* Favorites Drawer */}
      <FavoritesDrawer
        isOpen={isDrawerOpen}
        onClose={() => dispatch(setIsDrawerOpen(false))}
        onSelectTicket={handleSelectTicket}
      />

      {/* Boarding Pass Modal */}
      {boardingPassData && (
        <BoardingPassModal
          ticket={boardingPassData.ticket}
          seats={boardingPassData.seats}
          isOpen={!!boardingPassData}
          onClose={() => setBoardingPassData(null)}
        />
      )}
    </div>
  );
}
