'use client';

import type { Ticket } from '../types/ticket';
import { formatDuration } from '../lib/formatDuration';
import { formatPrice } from '../lib/formatPrice';
import { Card } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Badge } from '@/shared/ui/badge';
import { Luggage, Clock, Plane, Heart } from 'lucide-react';
import Image from 'next/image';

interface TicketCardProps {
  ticket: Ticket;
  onSelect?: (ticket: Ticket) => void;
  isFavorite?: boolean;
  onToggleFavorite?: (ticket: Ticket) => void;
  compact?: boolean;
}

function StopsIndicator({ stops, stopCities }: { stops: number; stopCities: string[] }) {
  if (stops === 0) {
    return (
      <div className="flex flex-col items-center gap-1">
        <div className="relative w-full flex items-center">
          <div className="flex-1 h-px bg-blue-300" />
          <Plane className="h-3.5 w-3.5 text-blue-500 mx-1 -rotate-0" />
          <div className="flex-1 h-px bg-blue-300" />
        </div>
        <span className="text-xs text-emerald-600 font-medium">Прямой</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative w-full flex items-center">
        <div className="flex-1 h-px bg-amber-300" />
        {Array.from({ length: stops }).map((_, i) => (
          <div key={i} className="flex items-center">
            <div className="h-2 w-2 rounded-full bg-amber-400 mx-1" />
            {i < stops - 1 && <div className="flex-1 h-px bg-amber-300" />}
          </div>
        ))}
        <div className="flex-1 h-px bg-amber-300" />
      </div>
      <span className="text-xs text-amber-600 font-medium">
        {stops} пересадк{stops === 1 ? 'а' : stops < 5 ? 'и' : 'ок'}
        {stopCities.length > 0 && ` · ${stopCities.join(', ')}`}
      </span>
    </div>
  );
}

export function TicketCard({
  ticket,
  onSelect,
  isFavorite = false,
  onToggleFavorite,
  compact = false,
}: TicketCardProps) {
  return (
    <Card hover className="relative p-5 sm:p-6 overflow-hidden">
      {onToggleFavorite && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(ticket);
          }}
          className={`
            absolute top-4 right-4 p-2 rounded-full
            bg-slate-50/80 hover:bg-slate-100 text-slate-400 hover:text-red-500
            transition-all duration-200 active:scale-90 z-10
            backdrop-blur-sm shadow-sm hover:shadow-md
            ${isFavorite ? 'text-red-500 bg-red-50/80 hover:bg-red-100/80' : ''}
            ${compact ? '' : 'lg:hidden'}
          `}
          title={isFavorite ? 'Удалить из избранного' : 'Добавить в избранное'}
        >
          <Heart className={`h-4.5 w-4.5 transition-transform duration-300 ${isFavorite ? 'fill-current scale-110' : 'hover:scale-110'}`} />
        </button>
      )}
      <div className={compact ? "flex flex-col gap-4" : "flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-6"}>
        {/* Airline + City image */}
        <div className={compact ? "flex items-center gap-3" : "flex items-center gap-3 lg:w-[160px] lg:flex-shrink-0"}>
          <div className="relative h-[88px] w-[88px] flex-shrink-0 overflow-hidden rounded-xl">
            <Image
              src={ticket.cityImage}
              alt={ticket.toCity}
              fill
              className="object-cover"
              sizes="88px"
            />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-800">
              {ticket.airline}
            </p>
            <p className="text-xs text-slate-400">{ticket.flightNumber}</p>
          </div>
        </div>

        {/* Flight times */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="text-center flex-shrink-0">
            <p className="text-xl font-bold text-slate-900">
              {ticket.departureTime}
            </p>
            <p className="text-xs text-slate-500">{ticket.from}</p>
          </div>

          <div className="flex-1 min-w-[80px] max-w-[180px] px-2">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Clock className="h-3 w-3 text-slate-400" />
              <span className="text-xs text-slate-500">
                {formatDuration(ticket.durationMinutes)}
              </span>
            </div>
            <StopsIndicator stops={ticket.stops} stopCities={ticket.stopCities} />
          </div>

          <div className="text-center flex-shrink-0">
            <p className="text-xl font-bold text-slate-900">
              {ticket.arrivalTime}
            </p>
            <p className="text-xs text-slate-500">{ticket.to}</p>
          </div>
        </div>

        {/* Badges */}
        <div className={compact ? "flex flex-wrap gap-1.5" : "flex flex-wrap gap-1.5 lg:w-[100px] lg:flex-shrink-0 lg:justify-center"}>
          {ticket.baggageIncluded && (
            <Badge variant="success">
              <Luggage className="h-3 w-3" />
              Багаж
            </Badge>
          )}
        </div>

        {/* Price & CTA */}
        <div className={compact ? "flex items-center justify-between gap-4 border-t border-slate-100 pt-4" : "flex items-center justify-between gap-4 lg:w-[270px] lg:flex-shrink-0 lg:justify-end border-t border-slate-100 pt-4 lg:border-0 lg:pt-0"}>
          <div className="text-right">
            <p className="text-2xl font-bold text-slate-900 whitespace-nowrap">
              {ticket.price.toLocaleString('ru-RU')} <span className="text-lg">₽</span>
            </p>
            <p className="text-xs text-slate-400">за 1 пассажира</p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              size="md"
              onClick={() => onSelect?.(ticket)}
              className="flex-shrink-0"
            >
              Выбрать
            </Button>

            {!compact && onToggleFavorite && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorite(ticket);
                }}
                className={`
                  hidden lg:flex items-center justify-center h-10 w-10 rounded-xl border
                  transition-all duration-200 active:scale-95 cursor-pointer flex-shrink-0
                  ${isFavorite 
                    ? 'bg-red-50 border-red-200 text-red-500 hover:bg-red-100 hover:border-red-300' 
                    : 'bg-slate-50 border-slate-200 text-slate-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50/30'
                  }
                `}
                title={isFavorite ? 'Удалить из избранного' : 'Добавить в избранное'}
              >
                <Heart className={`h-4.5 w-4.5 transition-transform duration-300 ${isFavorite ? 'fill-current text-red-500 scale-110' : 'hover:scale-110'}`} />
              </button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
