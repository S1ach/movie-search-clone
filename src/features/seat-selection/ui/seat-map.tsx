'use client';

import { useState, useMemo } from 'react';

export type SeatStatus = 'available' | 'occupied' | 'selected';
export type SeatClass = 'business' | 'comfort' | 'economy';

export interface Seat {
  id: string;
  row: number;
  col: string;
  status: SeatStatus;
  seatClass: SeatClass;
  price: number;
}

interface SeatMapProps {
  serviceClass: string;
  basePrice: number;
  passengers: number;
  onConfirm: (seats: Seat[]) => void;
  onCancel: () => void;
}

const ALL_COLS = ['A', 'B', 'C', 'D', 'E', 'F'];
// Business class only has A, C, D, F (wider seats, no B/E)
const BUSINESS_ACTIVE = new Set(['A', 'C', 'D', 'F']);

// Simple deterministic PRNG
function mulberry32(seed: number) {
  let s = seed;
  return function () {
    s |= 0;
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function generateSeats(): Seat[] {
  const seats: Seat[] = [];
  const random = mulberry32(42);

  // Business: rows 1-3, only A/C/D/F
  for (let row = 1; row <= 3; row++) {
    for (const col of ALL_COLS) {
      if (!BUSINESS_ACTIVE.has(col)) continue;
      seats.push({
        id: `${row}${col}`,
        row,
        col,
        status: random() > 0.55 ? 'available' : 'occupied',
        seatClass: 'business',
        price: 4500,
      });
    }
  }

  // Comfort: rows 4-8
  for (let row = 4; row <= 8; row++) {
    for (const col of ALL_COLS) {
      seats.push({
        id: `${row}${col}`,
        row,
        col,
        status: random() > 0.4 ? 'available' : 'occupied',
        seatClass: 'comfort',
        price: 2200,
      });
    }
  }

  // Economy: rows 9-30
  for (let row = 9; row <= 30; row++) {
    for (const col of ALL_COLS) {
      const isExitRow = row === 12 || row === 21;
      seats.push({
        id: `${row}${col}`,
        row,
        col,
        status: random() > 0.3 ? 'available' : 'occupied',
        seatClass: 'economy',
        price: isExitRow ? 1200 : 0,
      });
    }
  }

  return seats;
}

const SEAT_STYLES: Record<SeatClass, { available: string; selected: string; label: string }> = {
  business: {
    available: 'bg-violet-50 border-violet-300 hover:bg-violet-100',
    selected: 'bg-violet-600 border-violet-600 text-white shadow-md shadow-violet-200',
    label: 'Бизнес',
  },
  comfort: {
    available: 'bg-sky-50 border-sky-300 hover:bg-sky-100',
    selected: 'bg-sky-600 border-sky-600 text-white shadow-md shadow-sky-200',
    label: 'Комфорт',
  },
  economy: {
    available: 'bg-emerald-50 border-emerald-200 hover:bg-emerald-100',
    selected: 'bg-emerald-600 border-emerald-600 text-white shadow-md shadow-emerald-200',
    label: 'Эконом',
  },
};

export function SeatMap({ passengers, onConfirm, onCancel }: SeatMapProps) {
  const allSeats = useMemo(() => generateSeats(), []);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const seatMap = useMemo(() => {
    const m = new Map<string, Seat>();
    for (const s of allSeats) m.set(s.id, s);
    return m;
  }, [allSeats]);

  const toggleSeat = (seat: Seat) => {
    if (seat.status === 'occupied') return;
    setSelectedIds((prev) => {
      if (prev.includes(seat.id)) return prev.filter((id) => id !== seat.id);
      if (prev.length >= passengers) return [...prev.slice(1), seat.id];
      return [...prev, seat.id];
    });
  };

  const selectedSeats = selectedIds.map((id) => seatMap.get(id)!).filter(Boolean);
  const totalExtra = selectedSeats.reduce((sum, s) => sum + s.price, 0);

  // Rows grouped
  const rows = useMemo(() => {
    const set = new Set(allSeats.map((s) => s.row));
    return Array.from(set).sort((a, b) => a - b);
  }, [allSeats]);

  const getRowClass = (row: number): SeatClass => {
    if (row <= 3) return 'business';
    if (row <= 8) return 'comfort';
    return 'economy';
  };

  const isExitRow = (row: number) => row === 12 || row === 21;
  const isSectionStart = (row: number) => row === 1 || row === 4 || row === 9;

  const sectionLabels: Record<SeatClass, string> = {
    business: 'Бизнес-класс',
    comfort: 'Комфорт',
    economy: 'Эконом-класс',
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex-shrink-0 px-5 pt-5 pb-3 border-b border-slate-100">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-base font-bold text-slate-800">Выберите места</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {passengers === 1 ? 'Выберите 1 место' : `Выберите ${passengers} места`}
            </p>
          </div>
          <button
            onClick={onCancel}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-x-3 gap-y-1 text-[10px]">
          {Object.entries(SEAT_STYLES).map(([key, val]) => (
            <div key={key} className="flex items-center gap-1">
              <div className={`w-3.5 h-3.5 rounded-[3px] border ${val.available}`} />
              <span className="text-slate-500">{val.label}</span>
            </div>
          ))}
          <div className="flex items-center gap-1">
            <div className="w-3.5 h-3.5 rounded-[3px] bg-slate-100 border border-slate-200" />
            <span className="text-slate-500">Занято</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3.5 h-3.5 rounded-[3px] bg-blue-600 border border-blue-600" />
            <span className="text-slate-500">Ваше</span>
          </div>
        </div>
      </div>

      {/* Seat grid - scrollable */}
      <div className="flex-1 overflow-y-auto overscroll-contain px-3 py-3" style={{ maxHeight: 'calc(100vh - 320px)' }}>
        {/* Airplane nose */}
        <div className="flex justify-center mb-2">
          <div className="w-[200px] h-6 bg-gradient-to-b from-slate-100 to-slate-50 rounded-t-[50px] border border-b-0 border-slate-200 flex items-end justify-center pb-0.5">
            <span className="text-[8px] text-slate-400 font-semibold tracking-widest">ПЕРЕД</span>
          </div>
        </div>

        <div className="flex flex-col items-center">
          {rows.map((rowNum) => {
            const rowClass = getRowClass(rowNum);
            const isBiz = rowClass === 'business';

            return (
              <div key={rowNum} className="w-full max-w-[280px]">
                {/* Section header */}
                {isSectionStart(rowNum) && (
                  <>
                    <div className="flex items-center gap-2 mt-2 mb-1.5">
                      <div className="flex-1 h-px bg-slate-200" />
                      <span className="text-[9px] font-bold text-slate-400 tracking-wider uppercase">
                        {sectionLabels[rowClass]}
                      </span>
                      <div className="flex-1 h-px bg-slate-200" />
                    </div>

                    {/* Column headers */}
                    <div className="grid gap-[3px] mb-1" style={{ gridTemplateColumns: '20px repeat(3, 1fr) 16px repeat(3, 1fr) 20px' }}>
                      <div />
                      {isBiz ? (
                        <>
                          <div className="text-center text-[9px] font-medium text-slate-400">A</div>
                          <div />
                          <div className="text-center text-[9px] font-medium text-slate-400">C</div>
                          <div />
                          <div className="text-center text-[9px] font-medium text-slate-400">D</div>
                          <div />
                          <div className="text-center text-[9px] font-medium text-slate-400">F</div>
                        </>
                      ) : (
                        <>
                          <div className="text-center text-[9px] font-medium text-slate-400">A</div>
                          <div className="text-center text-[9px] font-medium text-slate-400">B</div>
                          <div className="text-center text-[9px] font-medium text-slate-400">C</div>
                          <div />
                          <div className="text-center text-[9px] font-medium text-slate-400">D</div>
                          <div className="text-center text-[9px] font-medium text-slate-400">E</div>
                          <div className="text-center text-[9px] font-medium text-slate-400">F</div>
                        </>
                      )}
                      <div />
                    </div>
                  </>
                )}

                {/* Exit row label */}
                {isExitRow(rowNum) && (
                  <div className="flex items-center justify-center gap-1 my-0.5">
                    <span className="text-[8px] text-orange-500 font-bold tracking-wider">▸ АВАРИЙНЫЙ ВЫХОД ◂</span>
                  </div>
                )}

                {/* Seat row */}
                <div
                  className="grid gap-[3px] mb-[3px]"
                  style={{ gridTemplateColumns: '20px repeat(3, 1fr) 16px repeat(3, 1fr) 20px' }}
                >
                  {/* Row number left */}
                  <div className="flex items-center justify-end pr-1 text-[9px] text-slate-300 font-medium">
                    {rowNum}
                  </div>

                  {/* Left group: A, B, C */}
                  {['A', 'B', 'C'].map((col) => {
                    if (isBiz && col === 'B') {
                      return <div key={col} />;
                    }
                    const seat = seatMap.get(`${rowNum}${col}`);
                    if (!seat) return <div key={col} />;
                    return (
                      <SeatButton
                        key={col}
                        seat={seat}
                        isSelected={selectedIds.includes(seat.id)}
                        isBiz={isBiz}
                        onClick={() => toggleSeat(seat)}
                      />
                    );
                  })}

                  {/* Aisle */}
                  <div className="flex items-center justify-center">
                    <div className="w-px h-4 bg-slate-100" />
                  </div>

                  {/* Right group: D, E, F */}
                  {['D', 'E', 'F'].map((col) => {
                    if (isBiz && col === 'E') {
                      return <div key={col} />;
                    }
                    const seat = seatMap.get(`${rowNum}${col}`);
                    if (!seat) return <div key={col} />;
                    return (
                      <SeatButton
                        key={col}
                        seat={seat}
                        isSelected={selectedIds.includes(seat.id)}
                        isBiz={isBiz}
                        onClick={() => toggleSeat(seat)}
                      />
                    );
                  })}

                  {/* Row number right */}
                  <div className="flex items-center justify-start pl-1 text-[9px] text-slate-300 font-medium">
                    {rowNum}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Airplane tail */}
        <div className="flex justify-center mt-2">
          <div className="w-[200px] h-5 bg-gradient-to-t from-slate-100 to-slate-50 rounded-b-[30px] border border-t-0 border-slate-200 flex items-start justify-center pt-0.5">
            <span className="text-[8px] text-slate-400 font-semibold tracking-widest">ХВОСТ</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex-shrink-0 px-5 py-3 border-t border-slate-100 bg-white">
        {/* Selected seats chips */}
        {selectedSeats.length > 0 && (
          <div className="mb-2.5 flex flex-wrap gap-1.5">
            {selectedSeats.map((seat) => (
              <span
                key={seat.id}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[11px] font-medium border border-blue-100"
              >
                Место {seat.id}
                {seat.price > 0 && (
                  <span className="text-blue-400 text-[10px]">+{seat.price.toLocaleString('ru-RU')} ₽</span>
                )}
                <button
                  type="button"
                  onClick={() => setSelectedIds((prev) => prev.filter((id) => id !== seat.id))}
                  className="ml-0.5 text-blue-300 hover:text-blue-600 text-xs leading-none"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400">Доплата за места</p>
            <p className="text-base font-bold text-slate-800">
              {totalExtra > 0 ? `+${totalExtra.toLocaleString('ru-RU')} ₽` : 'Бесплатно'}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onCancel}
              className="px-3 py-2 rounded-xl text-xs font-medium text-slate-500 hover:bg-slate-100 transition-colors"
            >
              Отмена
            </button>
            <button
              type="button"
              onClick={() => onConfirm(selectedSeats)}
              disabled={selectedSeats.length === 0}
              className={`
                px-5 py-2 rounded-xl text-xs font-semibold transition-all duration-200
                ${
                  selectedSeats.length > 0
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-md shadow-blue-500/20'
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                }
              `}
            >
              {selectedSeats.length === passengers
                ? 'Подтвердить'
                : `Выбрано ${selectedSeats.length} из ${passengers}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────── Individual seat button ─────── */

function SeatButton({
  seat,
  isSelected,
  isBiz,
  onClick,
}: {
  seat: Seat;
  isSelected: boolean;
  isBiz: boolean;
  onClick: () => void;
}) {
  const isOccupied = seat.status === 'occupied';
  const style = SEAT_STYLES[seat.seatClass];

  let classes: string;
  if (isOccupied) {
    classes = 'bg-slate-50 border-slate-200 cursor-not-allowed';
  } else if (isSelected) {
    classes = style.selected + ' cursor-pointer transform scale-[1.05]';
  } else {
    classes = style.available + ' cursor-pointer';
  }

  return (
    <button
      type="button"
      disabled={isOccupied}
      onClick={onClick}
      title={
        isOccupied
          ? 'Занято'
          : `${seat.id} — ${seat.price > 0 ? `+${seat.price.toLocaleString('ru-RU')} ₽` : 'Бесплатно'}`
      }
      className={`
        ${isBiz ? 'h-8 rounded-md' : 'h-7 rounded-[4px]'}
        w-full border text-[9px] font-medium
        flex items-center justify-center
        transition-all duration-150
        ${classes}
      `}
    >
      {isOccupied ? (
        <span className="text-slate-300 text-[10px]">×</span>
      ) : isSelected ? (
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      ) : null}
    </button>
  );
}
