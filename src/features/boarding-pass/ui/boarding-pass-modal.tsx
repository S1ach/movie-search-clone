'use client';

import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import type { Ticket } from '@/entities/ticket';
import type { Seat } from '@/features/seat-selection';
import { BoardingPass } from './boarding-pass';
import { X, Printer, CheckCircle2, User, ArrowLeft } from 'lucide-react';
import { Button } from '@/shared/ui/button';

interface BoardingPassModalProps {
  ticket: Ticket;
  seats: Seat[];
  isOpen: boolean;
  onClose: () => void;
}

export function BoardingPassModal({ ticket, seats, isOpen, onClose }: BoardingPassModalProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [passengerNames, setPassengerNames] = useState<string[]>(
    Array.from({ length: seats.length }).map((_, i) => '')
  );

  const backdropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

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

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === backdropRef.current) onClose();
  };

  const handleNameChange = (index: number, val: string) => {
    const next = [...passengerNames];
    next[index] = val;
    setPassengerNames(next);
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      ref={backdropRef}
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-fade-in no-print"
    >
      <div
        className="
          relative w-full max-w-4xl bg-slate-50 rounded-2xl shadow-2xl
          flex flex-col overflow-hidden max-h-[90vh]
          animate-slide-up
        "
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">Заказ успешно оформлен!</h2>
              <p className="text-xs text-slate-500">Билеты готовы к распечатке</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Passenger Names input form */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
              <User className="h-4.5 w-4.5 text-blue-600" />
              Введите данные пассажиров для посадочных талонов
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {seats.map((seat, i) => (
                <div key={seat.id} className="space-y-1">
                  <label htmlFor={`name-${i}`} className="block text-xs font-semibold text-slate-500">
                    Пассажир {i + 1} (Место {seat.id}, Класс: {seat.seatClass})
                  </label>
                  <div className="relative">
                    <input
                      id={`name-${i}`}
                      type="text"
                      placeholder="ИВАН ИВАНОВ / IVAN IVANOV"
                      value={passengerNames[i]}
                      onChange={(e) => handleNameChange(i, e.target.value)}
                      className="
                        w-full rounded-xl border border-slate-200 bg-slate-50/50
                        px-3 py-2 text-sm text-slate-800 placeholder-slate-400
                        transition-all duration-200
                        focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500
                      "
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Ticket Previews Heading */}
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Предпросмотр билетов</h3>
            <span className="text-xs text-slate-400">
              {seats.length} {seats.length === 1 ? 'билет' : seats.length < 5 ? 'билета' : 'билетов'}
            </span>
          </div>

          {/* Boarding Passes (Visible on screen in the modal scrollview) */}
          <div className="space-y-4">
            {seats.map((seat, i) => (
              <BoardingPass
                key={seat.id}
                ticket={ticket}
                passengerName={passengerNames[i].trim() || `ПАССАЖИР ${i + 1}`}
                seatId={seat.id}
              />
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-slate-200 bg-white px-6 py-4 flex-shrink-0">
          <Button variant="outline" size="md" onClick={onClose} className="gap-2">
            <ArrowLeft className="h-4 w-4" /> На главную
          </Button>

          <Button variant="primary" size="md" onClick={handlePrint} className="gap-2 shadow-lg shadow-blue-500/20">
            <Printer className="h-4 w-4" /> Распечатать билеты
          </Button>
        </div>
      </div>

      {/* Portal to document.body for printing (guarantees direct body child for clean display:none overrides) */}
      {isMounted && createPortal(
        <div className="print-only-container">
          {seats.map((seat, i) => (
            <BoardingPass
              key={seat.id}
              ticket={ticket}
              passengerName={passengerNames[i].trim() || `ПАССАЖИР ${i + 1}`}
              seatId={seat.id}
            />
          ))}
        </div>,
        document.body
      )}

      {/* Global CSS style block for printing */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            /* Hide print portal copy on regular screen */
            .print-only-container {
              display: none !important;
            }

            @media print {
              /* Setup page margins and print size */
              @page {
                size: A4 portrait;
                margin: 1.5cm 1cm;
              }

              /* Hide absolutely everything under the body except the print portal container */
              body > *:not(.print-only-container) {
                display: none !important;
                visibility: hidden !important;
              }

              /* Force body background to white */
              body {
                background: white !important;
                color: black !important;
                margin: 0 !important;
                padding: 0 !important;
                visibility: hidden !important;
              }

              /* Render the print container */
              .print-only-container {
                display: block !important;
                visibility: visible !important;
                position: absolute !important;
                left: 0 !important;
                top: 0 !important;
                width: 100% !important;
                margin: 0 !important;
                padding: 0 !important;
              }

              .print-only-container * {
                visibility: visible !important;
              }

              /* Style each boarding pass card for page breaks and premium print layout */
              .print-section {
                display: flex !important;
                flex-direction: column !important;
                page-break-after: always !important;
                break-after: page !important;
                margin: 0 auto 1.5cm auto !important;
                width: 18cm !important;
                height: auto !important;
                box-shadow: none !important;
                border: none !important;
                border-radius: 0 !important;
                overflow: visible !important;
                background-color: white !important;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              }

              .print-section:last-child {
                page-break-after: avoid !important;
                break-after: avoid !important;
                margin-bottom: 0 !important;
              }

              /* Print-specific overrides for high contrast black/gray borders */
              .print-section .border {
                border: 1px solid #475569 !important;
              }
              
              .print-section .border-b {
                border-bottom: 1px solid #475569 !important;
              }

              .print-section .border-t {
                border-top: 1px solid #cbd5e1 !important;
              }

              .print-section .border-l {
                border-left: 1px solid #cbd5e1 !important;
              }

              .print-section .border-dashed {
                border-style: dashed !important;
                border-color: #475569 !important;
              }

              /* Force background colors on badges and icons */
              .print-section .bg-slate-100 {
                background-color: #f1f5f9 !important;
              }

              .print-section .bg-slate-50\/50 {
                background-color: #f8fafc !important;
              }

              .print-section .bg-blue-600 {
                background-color: #2563eb !important;
              }

              .print-section .text-blue-600 {
                color: #2563eb !important;
              }

              .print-section .text-emerald-600 {
                color: #059669 !important;
              }
            }
          `,
        }}
      />
    </div>
  );
}
