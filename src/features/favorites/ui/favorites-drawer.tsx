'use client';

import { useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/providers/hooks';
import { toggleFavorite } from '../model/favoritesSlice';
import { TicketCard } from '@/entities/ticket';
import { X, Heart, Plane } from 'lucide-react';
import type { Ticket } from '@/entities/ticket';

interface FavoritesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTicket: (ticket: Ticket) => void;
}

export function FavoritesDrawer({ isOpen, onClose, onSelectTicket }: FavoritesDrawerProps) {
  const dispatch = useAppDispatch();
  const favorites = useAppSelector((state) => state.favorites.items);
  const backdropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === backdropRef.current) {
      onClose();
    }
  };

  const handleSelect = (ticket: Ticket) => {
    onSelectTicket(ticket);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      ref={backdropRef}
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs animate-fade-in"
    >
      <div
        className="
          relative w-full max-w-lg bg-white shadow-2xl h-full flex flex-col
          transition-transform duration-300 ease-out transform
          animate-slide-left
        "
        style={{
          animation: 'slideLeft 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
          <div className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-red-500 fill-current" />
            <h2 className="text-lg font-bold text-slate-800">Избранные билеты</h2>
            <span className="inline-flex h-5.5 min-w-5.5 items-center justify-center rounded-full bg-red-50 px-1.5 text-xs font-semibold text-red-500">
              {favorites.length}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5 bg-slate-50/50">
          {favorites.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center p-8">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-400">
                <Heart className="h-7 w-7" />
              </div>
              <h3 className="text-base font-bold text-slate-800 mb-1">
                В избранном пока пусто
              </h3>
              <p className="text-xs text-slate-400 max-w-[280px]">
                Нажимайте на сердечко ❤️ на карточках билетов, чтобы сохранить их здесь
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {favorites.map((ticket) => (
                <div key={ticket.id} className="relative group">
                  <TicketCard
                    ticket={ticket}
                    isFavorite={true}
                    onToggleFavorite={(t) => dispatch(toggleFavorite(t))}
                    onSelect={handleSelect}
                    compact={true}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes slideLeft {
              from {
                transform: translateX(100%);
              }
              to {
                transform: translateX(0);
              }
            }
          `,
        }}
      />
    </div>
  );
}
