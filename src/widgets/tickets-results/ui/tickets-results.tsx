'use client';

import Image from 'next/image';
import type { Ticket, SortOption } from '@/entities/ticket';
import { TicketCard } from '@/entities/ticket';
import { TicketCardSkeleton } from '@/shared/ui/skeleton';
import { EmptyState } from '@/shared/ui/empty-state';
import { ErrorState } from '@/shared/ui/error-state';
import { SortTicketsSelect } from '@/features/sort-tickets';
import { TrendingUp, Flame, Sparkles } from 'lucide-react';

export interface PopularRoute {
  fromCode: string;
  toCode: string;
  fromCity: string;
  toCity: string;
  image: string;
  priceFrom: number;
  tag: string;
  tagIcon: typeof Flame;
  tagColor: string;
}

const POPULAR_ROUTES: PopularRoute[] = [
  {
    fromCode: 'SVO',
    toCode: 'LED',
    fromCity: 'Москва',
    toCity: 'Санкт-Петербург',
    image: '/cities/saint-petersburg.png',
    priceFrom: 2990,
    tag: 'Популярное',
    tagIcon: Flame,
    tagColor: 'text-orange-400',
  },
  {
    fromCode: 'SVO',
    toCode: 'AER',
    fromCity: 'Москва',
    toCity: 'Сочи',
    image: '/cities/sochi.png',
    priceFrom: 3950,
    tag: 'Лето',
    tagIcon: Sparkles,
    tagColor: 'text-amber-400',
  },
  {
    fromCode: 'SVO',
    toCode: 'KGD',
    fromCity: 'Москва',
    toCity: 'Калининград',
    image: '/cities/kaliningrad.png',
    priceFrom: 5800,
    tag: 'Тренд',
    tagIcon: TrendingUp,
    tagColor: 'text-emerald-400',
  },
  {
    fromCode: 'SVO',
    toCode: 'KZN',
    fromCity: 'Москва',
    toCity: 'Казань',
    image: '/cities/kazan.png',
    priceFrom: 4750,
    tag: 'Популярное',
    tagIcon: Flame,
    tagColor: 'text-orange-400',
  },
  {
    fromCode: 'VKO',
    toCode: 'KRR',
    fromCity: 'Москва',
    toCity: 'Краснодар',
    image: '/cities/krasnodar.png',
    priceFrom: 3200,
    tag: 'Выгодно',
    tagIcon: TrendingUp,
    tagColor: 'text-emerald-400',
  },
  {
    fromCode: 'LED',
    toCode: 'AER',
    fromCity: 'Санкт-Петербург',
    toCity: 'Сочи',
    image: '/cities/sochi-2.png',
    priceFrom: 5400,
    tag: 'Тренд',
    tagIcon: TrendingUp,
    tagColor: 'text-emerald-400',
  },
];

interface TicketsResultsProps {
  tickets: Ticket[];
  isLoading: boolean;
  isError: boolean;
  hasSearched: boolean;
  sortOption: SortOption;
  onSortChange: (sort: SortOption) => void;
  onRetry: () => void;
  onSelectTicket: (ticket: Ticket) => void;
  onRouteClick?: (fromCode: string, toCode: string) => void;
  favorites?: Ticket[];
  onToggleFavorite?: (ticket: Ticket) => void;
}

export function TicketsResults({
  tickets,
  isLoading,
  isError,
  hasSearched,
  sortOption,
  onSortChange,
  onRetry,
  onSelectTicket,
  onRouteClick,
  favorites = [],
  onToggleFavorite,
}: TicketsResultsProps) {
  if (!hasSearched) {
    return (
      <div>
        <div className="mb-6">
          <h2 className="text-xl font-bold text-slate-800 mb-1">
            Рекомендуемые направления
          </h2>
          <p className="text-sm text-slate-400">
            Популярные маршруты с лучшими ценами
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {POPULAR_ROUTES.map((route) => {
            const TagIcon = route.tagIcon;
            return (
              <button
                type="button"
                key={`${route.fromCode}-${route.toCode}`}
                onClick={() => onRouteClick?.(route.fromCode, route.toCode)}
                className="
                  group relative rounded-2xl overflow-hidden
                  h-[220px] text-left
                  transition-all duration-300
                  hover:shadow-xl hover:shadow-slate-300/40 hover:-translate-y-1
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2
                "
              >
                {/* Background image */}
                <Image
                  src={route.image}
                  alt={route.toCity}
                  fill
                  priority
                  loading="eager"
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                {/* Tag — top left */}
                <div className="absolute top-3 left-3">
                  <span className={`
                    inline-flex items-center gap-1 rounded-full
                    bg-white/20 backdrop-blur-md px-2.5 py-1
                    text-[11px] font-semibold text-white
                  `}>
                    <TagIcon className="h-3 w-3" />
                    {route.tag}
                  </span>
                </div>

                {/* Content — bottom */}
                <div className="absolute inset-x-0 bottom-0 p-4">
                  <p className="text-xs text-white/70 mb-0.5">
                    {route.fromCity} →
                  </p>
                  <h3 className="text-lg font-bold text-white tracking-tight mb-2">
                    {route.toCity}
                  </h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-xs text-white/60">от</span>
                    <span className="text-base font-bold text-white">
                      {route.priceFrom.toLocaleString('ru-RU')} ₽
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-2">
          <div className="h-5 w-32 animate-pulse bg-slate-200 rounded" />
          <div className="h-9 w-48 animate-pulse bg-slate-200 rounded-xl" />
        </div>
        {Array.from({ length: 4 }).map((_, i) => (
          <TicketCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (isError) {
    return <ErrorState onRetry={onRetry} />;
  }

  if (tickets.length === 0) {
    return (
      <EmptyState
        title="Билеты не найдены"
        description="По вашему запросу ничего не нашлось. Попробуйте изменить города или даты."
      />
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5">
        <p className="text-sm text-slate-500">
          Найдено{' '}
          <span className="font-semibold text-slate-800">
            {tickets.length}
          </span>{' '}
          {getTicketWord(tickets.length)}
        </p>
        <SortTicketsSelect value={sortOption} onChange={onSortChange} />
      </div>

      <div className="space-y-3">
        {tickets.map((ticket) => {
          const isFavorite = favorites.some((f) => f.id === ticket.id);
          return (
            <TicketCard
              key={ticket.id}
              ticket={ticket}
              isFavorite={isFavorite}
              onToggleFavorite={onToggleFavorite}
              onSelect={onSelectTicket}
            />
          );
        })}
      </div>
    </div>
  );
}

function getTicketWord(count: number): string {
  const mod10 = count % 10;
  const mod100 = count % 100;

  if (mod100 >= 11 && mod100 <= 14) return 'билетов';
  if (mod10 === 1) return 'билет';
  if (mod10 >= 2 && mod10 <= 4) return 'билета';
  return 'билетов';
}

