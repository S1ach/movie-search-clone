'use client';

import { useCallback, useEffect, useRef } from 'react';
import Image from 'next/image';
import type { Ticket } from '@/entities/ticket/types/ticket';
import { formatPrice } from '@/entities/ticket/lib/formatPrice';
import { SeatMap } from './seat-map';
import type { Seat } from './seat-map';

interface SeatSelectionModalProps {
  ticket: Ticket;
  passengers: number;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (ticket: Ticket, seats: Seat[]) => void;
}

export function SeatSelectionModal({
  ticket,
  passengers,
  isOpen,
  onClose,
  onConfirm,
}: SeatSelectionModalProps) {
  const backdropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === backdropRef.current) onClose();
    },
    [onClose]
  );

  const handleConfirm = useCallback(
    (seats: Seat[]) => {
      onConfirm(ticket, seats);
      onClose();
    },
    [ticket, onConfirm, onClose]
  );

  if (!isOpen) return null;

  return (
    <div
      ref={backdropRef}
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/40 backdrop-blur-sm animate-fade-in"
    >
      <div
        className="
          relative w-full max-w-md bg-white rounded-2xl shadow-2xl
          flex flex-col overflow-hidden
          animate-slide-up
        "
        style={{ maxHeight: 'calc(100vh - 32px)' }}
      >
        {/* Ticket header */}
        <div className="flex-shrink-0 bg-gradient-to-r from-blue-600 to-indigo-700 px-5 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Image src={ticket.airlineLogo} alt={ticket.airline} width={28} height={28} className="rounded-md" />
              <div>
                <p className="text-sm font-semibold text-white">{ticket.airline}</p>
                <p className="text-[11px] text-blue-200">{ticket.flightNumber}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[11px] font-medium text-blue-200">
                {ticket.from} → {ticket.to}
              </p>
              <p className="text-sm font-bold text-white">
                {formatPrice(ticket.price, ticket.currency)}
              </p>
            </div>
          </div>
        </div>

        {/* Seat Map */}
        <SeatMap
          serviceClass={ticket.serviceClass}
          basePrice={ticket.price}
          passengers={passengers}
          onConfirm={handleConfirm}
          onCancel={onClose}
        />
      </div>
    </div>
  );
}
