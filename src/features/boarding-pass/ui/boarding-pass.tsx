'use client';

import Image from 'next/image';
import type { Ticket } from '@/entities/ticket';
import { Plane, Star, FileText, Briefcase, ShieldAlert, DoorOpen } from 'lucide-react';

interface BoardingPassProps {
  ticket: Ticket;
  passengerName: string;
  seatId: string;
}

const AIRPORT_NAMES: Record<string, string> = {
  SVO: 'Шереметьево / Sheremetyevo',
  VKO: 'Внуково / Vnukovo',
  DME: 'Домодедово / Domodedovo',
  LED: 'Пулково / Pulkovo',
  AER: 'Сочи-Адлер / Sochi-Adler',
  KGD: 'Храброво / Khrabrovo',
  KZN: 'Казань / Kazan',
  OVB: 'Толмачево / Tolmachevo',
  SVX: 'Кольцово / Koltsovo',
  VVO: 'Кневичи / Knevichi',
  TJM: 'Рощино / Roshchino',
  UFA: 'Уфа / Ufa',
};

export function BoardingPass({ ticket, passengerName, seatId }: BoardingPassProps) {
  // Generate boarding time (e.g. 40 minutes before departure)
  const getBoardingTime = (departureTime: string) => {
    try {
      const [hours, minutes] = departureTime.split(':').map(Number);
      let boardingHours = hours;
      let boardingMinutes = minutes - 40;

      if (boardingMinutes < 0) {
        boardingMinutes += 60;
        boardingHours -= 1;
        if (boardingHours < 0) {
          boardingHours += 24;
        }
      }

      const pad = (n: number) => String(n).padStart(2, '0');
      return `${pad(boardingHours)}:${pad(boardingMinutes)}`;
    } catch {
      return '10:00';
    }
  };

  const boardingTime = getBoardingTime(ticket.departureTime);

  // Class label translation
  const classLabels: Record<string, string> = {
    economy: 'ЭКОНОМ / ECONOMY CLASS',
    comfort: 'КОМФОРТ / COMFORT CLASS',
    business: 'БИЗНЕС / BUSINESS CLASS',
    first: 'ПЕРВЫЙ / FIRST CLASS',
  };

  const serviceClassLabel = classLabels[ticket.serviceClass] || 'ЭКОНОМ / ECONOMY CLASS';

  // Mock ticket number
  const ticketNumber = `ETKT 555${ticket.id.padStart(3, '0')}${seatId.charCodeAt(0)}${seatId.charCodeAt(1 || 0)}2857`;

  // Airport name lookup
  const fromAirport = AIRPORT_NAMES[ticket.from] || 'Международный аэропорт';
  const toAirport = AIRPORT_NAMES[ticket.to] || 'Международный аэропорт';

  // Barcode SVGs
  const BarcodeHorizontal = () => (
    <svg className="w-full h-9 text-slate-900" viewBox="0 0 100 20" preserveAspectRatio="none">
      <rect x="0" y="0" width="1.5" height="20" fill="currentColor"/>
      <rect x="2" y="0" width="0.5" height="20" fill="currentColor"/>
      <rect x="3.5" y="0" width="1" height="20" fill="currentColor"/>
      <rect x="5.5" y="0" width="2.5" height="20" fill="currentColor"/>
      <rect x="9" y="0" width="0.5" height="20" fill="currentColor"/>
      <rect x="10.5" y="0" width="1.5" height="20" fill="currentColor"/>
      <rect x="13" y="0" width="2" height="20" fill="currentColor"/>
      <rect x="16" y="0" width="0.5" height="20" fill="currentColor"/>
      <rect x="17.5" y="0" width="1" height="20" fill="currentColor"/>
      <rect x="19.5" y="0" width="3" height="20" fill="currentColor"/>
      <rect x="23.5" y="0" width="0.5" height="20" fill="currentColor"/>
      <rect x="25" y="0" width="1.5" height="20" fill="currentColor"/>
      <rect x="27.5" y="0" width="2" height="20" fill="currentColor"/>
      <rect x="30.5" y="0" width="0.5" height="20" fill="currentColor"/>
      <rect x="32" y="0" width="1.5" height="20" fill="currentColor"/>
      <rect x="34.5" y="0" width="2.5" height="20" fill="currentColor"/>
      <rect x="38" y="0" width="1" height="20" fill="currentColor"/>
      <rect x="40" y="0" width="0.5" height="20" fill="currentColor"/>
      <rect x="41.5" y="0" width="2" height="20" fill="currentColor"/>
      <rect x="44.5" y="0" width="1.5" height="20" fill="currentColor"/>
      <rect x="47" y="0" width="3" height="20" fill="currentColor"/>
      <rect x="51" y="0" width="0.5" height="20" fill="currentColor"/>
      <rect x="52.5" y="0" width="1" height="20" fill="currentColor"/>
      <rect x="54.5" y="0" width="2" height="20" fill="currentColor"/>
      <rect x="57.5" y="0" width="1.5" height="20" fill="currentColor"/>
      <rect x="60" y="0" width="0.5" height="20" fill="currentColor"/>
      <rect x="61.5" y="0" width="2.5" height="20" fill="currentColor"/>
      <rect x="65" y="0" width="1" height="20" fill="currentColor"/>
      <rect x="67" y="0" width="2" height="20" fill="currentColor"/>
      <rect x="70" y="0" width="0.5" height="20" fill="currentColor"/>
      <rect x="71.5" y="0" width="1.5" height="20" fill="currentColor"/>
      <rect x="74" y="0" width="3" height="20" fill="currentColor"/>
      <rect x="78" y="0" width="1" height="20" fill="currentColor"/>
      <rect x="80" y="0" width="2" height="20" fill="currentColor"/>
      <rect x="83" y="0" width="0.5" height="20" fill="currentColor"/>
      <rect x="84.5" y="0" width="1.5" height="20" fill="currentColor"/>
      <rect x="87" y="0" width="2" height="20" fill="currentColor"/>
      <rect x="90" y="0" width="1" height="20" fill="currentColor"/>
      <rect x="92" y="0" width="3" height="20" fill="currentColor"/>
      <rect x="96" y="0" width="0.5" height="20" fill="currentColor"/>
      <rect x="97.5" y="0" width="1.5" height="20" fill="currentColor"/>
      <rect x="99.5" y="0" width="0.5" height="20" fill="currentColor"/>
    </svg>
  );

  const BarcodeVertical = () => (
    <svg className="h-full w-full text-slate-900" viewBox="0 0 20 100" preserveAspectRatio="none">
      <rect x="0" y="0" width="20" height="1.5" fill="currentColor"/>
      <rect x="0" y="2" width="20" height="0.5" fill="currentColor"/>
      <rect x="0" y="3.5" width="20" height="1" fill="currentColor"/>
      <rect x="0" y="5.5" width="20" height="2.5" fill="currentColor"/>
      <rect x="0" y="9" width="20" height="0.5" fill="currentColor"/>
      <rect x="0" y="10.5" width="20" height="1.5" fill="currentColor"/>
      <rect x="0" y="13" width="20" height="2" fill="currentColor"/>
      <rect x="0" y="16" width="20" height="0.5" fill="currentColor"/>
      <rect x="0" y="17.5" width="20" height="1" fill="currentColor"/>
      <rect x="0" y="19.5" width="20" height="3" fill="currentColor"/>
      <rect x="0" y="23.5" width="20" height="0.5" fill="currentColor"/>
      <rect x="0" y="25" width="20" height="1.5" fill="currentColor"/>
      <rect x="0" y="27.5" width="20" height="2" fill="currentColor"/>
      <rect x="0" y="30.5" width="20" height="0.5" fill="currentColor"/>
      <rect x="0" y="32" width="20" height="1.5" fill="currentColor"/>
      <rect x="0" y="34.5" width="20" height="2.5" fill="currentColor"/>
      <rect x="0" y="38" width="20" height="1" fill="currentColor"/>
      <rect x="0" y="40" width="20" height="0.5" fill="currentColor"/>
      <rect x="0" y="41.5" width="20" height="2" fill="currentColor"/>
      <rect x="0" y="44.5" width="20" height="1.5" fill="currentColor"/>
      <rect x="0" y="47" width="20" height="3" fill="currentColor"/>
      <rect x="0" y="51" width="20" height="0.5" fill="currentColor"/>
      <rect x="0" y="52.5" width="20" height="1" fill="currentColor"/>
      <rect x="0" y="54.5" width="20" height="2" fill="currentColor"/>
      <rect x="0" y="57.5" width="20" height="1.5" fill="currentColor"/>
      <rect x="0" y="60" width="20" height="0.5" fill="currentColor"/>
      <rect x="0" y="61.5" width="20" height="2.5" fill="currentColor"/>
      <rect x="0" y="65" width="20" height="1" fill="currentColor"/>
      <rect x="0" y="67" width="20" height="2" fill="currentColor"/>
      <rect x="0" y="70" width="20" height="0.5" fill="currentColor"/>
      <rect x="0" y="71.5" width="20" height="1.5" fill="currentColor"/>
      <rect x="0" y="74" width="20" height="3" fill="currentColor"/>
      <rect x="0" y="78" width="20" height="1" fill="currentColor"/>
      <rect x="0" y="80" width="20" height="2" fill="currentColor"/>
      <rect x="0" y="83" width="20" height="0.5" fill="currentColor"/>
      <rect x="0" y="84.5" width="20" height="1.5" fill="currentColor"/>
      <rect x="0" y="87" width="20" height="2" fill="currentColor"/>
      <rect x="0" y="90" width="20" height="1" fill="currentColor"/>
      <rect x="0" y="92" width="20" height="3" fill="currentColor"/>
      <rect x="0" y="96" width="20" height="0.5" fill="currentColor"/>
      <rect x="0" y="97.5" width="20" height="1.5" fill="currentColor"/>
      <rect x="0" y="99.5" width="20" height="0.5" fill="currentColor"/>
    </svg>
  );

  return (
    <div className="print-section flex flex-col w-full max-w-[700px] mx-auto bg-white border border-slate-300 rounded-2xl overflow-hidden shadow-lg p-6 sm:p-8 space-y-6 my-4 print:my-0 print:border-none print:shadow-none print:p-0 print:rounded-none">
      
      {/* ─── TOP SECTION: LOGO + TITLE + BARCODE ─── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-24">
            <Image src={ticket.airlineLogo} alt={ticket.airline} fill className="object-contain object-left" />
          </div>
          <div className="h-8 w-px bg-slate-300" />
          <div>
            <h2 className="text-sm font-extrabold text-slate-800 tracking-wider uppercase leading-none">
              Посадочный талон
            </h2>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">
              Boarding Pass
            </p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1 w-36">
          <BarcodeHorizontal />
          <p className="text-[8px] font-mono text-slate-500 tracking-widest">{ticketNumber}</p>
        </div>
      </div>

      {/* ─── MAIN TICKET COUPON (BORDER BOXED) ─── */}
      <div className="border border-slate-400 rounded-xl overflow-hidden bg-white">
        {/* Name Header */}
        <div className="bg-slate-100 border-b border-slate-400 px-4 py-2 flex items-center justify-between">
          <div>
            <span className="text-[9px] text-slate-400 font-bold uppercase block leading-none">Пассажир / Passenger</span>
            <span className="text-base font-extrabold text-slate-900 uppercase tracking-wide">{passengerName}</span>
          </div>
          <div className="text-right">
            <span className="text-[9px] text-slate-400 font-bold uppercase block leading-none">Электронный билет / E-Ticket</span>
            <span className="text-xs font-mono font-bold text-slate-700">{ticketNumber}</span>
          </div>
        </div>

        <div className="p-4 space-y-4">
          {/* Cities & Direction */}
          <div className="grid grid-cols-3 items-center">
            <div>
              <p className="text-3xl font-black text-slate-900 leading-none">{ticket.from}</p>
              <p className="text-[10px] font-bold text-slate-500 uppercase mt-0.5">{ticket.fromCity}</p>
              <p className="text-[9px] text-slate-400 mt-0.5 leading-tight truncate">{fromAirport}</p>
            </div>
            <div className="flex flex-col items-center justify-center">
              <div className="w-full flex items-center gap-1.5 justify-center">
                <div className="h-px bg-slate-300 flex-1" />
                <Plane className="h-4.5 w-4.5 text-slate-700 rotate-90" />
                <div className="h-px bg-slate-300 flex-1" />
              </div>
              <span className="text-[9px] font-extrabold text-slate-400 tracking-wider uppercase mt-1">
                РЕЙС / FLIGHT
              </span>
            </div>
            <div className="text-right">
              <p className="text-3xl font-black text-slate-900 leading-none">{ticket.to}</p>
              <p className="text-[10px] font-bold text-slate-500 uppercase mt-0.5">{ticket.toCity}</p>
              <p className="text-[9px] text-slate-400 mt-0.5 leading-tight truncate">{toAirport}</p>
            </div>
          </div>

          {/* Times & Dates */}
          <div className="grid grid-cols-2 gap-4 pt-3 border-t border-slate-200">
            <div className="flex justify-between items-baseline">
              <div>
                <span className="text-[9px] text-slate-400 font-bold uppercase block">Вылет / Departure</span>
                <span className="text-base font-extrabold text-slate-800">{ticket.departureTime}</span>
              </div>
              <span className="text-xs font-bold text-slate-600">15 ИЮНЯ 2026</span>
            </div>
            <div className="flex justify-between items-baseline pl-4 border-l border-slate-200">
              <div>
                <span className="text-[9px] text-slate-400 font-bold uppercase block">Прилет / Arrival</span>
                <span className="text-base font-extrabold text-slate-800">{ticket.arrivalTime}</span>
              </div>
              <span className="text-xs font-bold text-slate-600">15 ИЮНЯ 2026</span>
            </div>
          </div>

          {/* Boarding Info Grid */}
          <div className="grid grid-cols-4 gap-2 pt-3 border-t border-slate-200 bg-slate-50/50 -mx-4 -mb-4 px-4 py-3">
            <div>
              <span className="text-[9px] text-slate-400 font-bold uppercase block leading-none">Рейс / Flight</span>
              <span className="text-sm font-extrabold text-slate-800">{ticket.flightNumber}</span>
            </div>
            <div>
              <span className="text-[9px] text-slate-400 font-bold uppercase block leading-none">Место / Seat</span>
              <span className="text-sm font-black text-blue-600">{seatId}</span>
            </div>
            <div>
              <span className="text-[9px] text-slate-400 font-bold uppercase block leading-none">Посадка / Boarding</span>
              <span className="text-sm font-extrabold text-emerald-600">{boardingTime}</span>
            </div>
            <div>
              <span className="text-[9px] text-slate-400 font-bold uppercase block leading-none">Выход / Gate</span>
              <span className="text-sm font-extrabold text-slate-800">A08</span>
            </div>
          </div>
        </div>
      </div>

      {/* ─── PERFORATION LINE ─── */}
      <div className="relative w-full flex items-center justify-center my-1 print:my-0">
        <div className="w-full h-px border-t border-dashed border-slate-400" />
        <span className="absolute px-2.5 py-0.5 rounded-full bg-slate-100 text-[8px] font-bold text-slate-400 uppercase tracking-widest border border-slate-200 print:hidden">
          Линия отреза / Tear Line
        </span>
      </div>

      {/* ─── MID SECTION: INSTRUCTIONS GRID ─── */}
      <div className="space-y-3">
        <h3 className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
          Информация о перелете / Flight Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex gap-3 text-xs">
            <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
              <FileText className="h-4 w-4" />
            </div>
            <div>
              <p className="font-bold text-slate-800 leading-tight">Документы к вылету</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Предъявите паспорт и распечатанный посадочный талон при посадке.</p>
            </div>
          </div>
          <div className="flex gap-3 text-xs">
            <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
              <Briefcase className="h-4 w-4" />
            </div>
            <div>
              <p className="font-bold text-slate-800 leading-tight">Сдача багажа</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Багаж необходимо сдать на стойке регистрации не позднее 40 минут до вылета.</p>
            </div>
          </div>
          <div className="flex gap-3 text-xs">
            <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
              <ShieldAlert className="h-4 w-4" />
            </div>
            <div>
              <p className="font-bold text-slate-800 leading-tight">Предполетный досмотр</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Запрещено провозить жидкости объемом более 100 мл в ручной клади.</p>
            </div>
          </div>
          <div className="flex gap-3 text-xs">
            <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
              <DoorOpen className="h-4 w-4" />
            </div>
            <div>
              <p className="font-bold text-slate-800 leading-tight">Посадка на рейс</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Посадка закрывается за 20 минут до вылета. Следите за табло в терминале.</p>
            </div>
          </div>
        </div>
      </div>

      {/* ─── PERFORATION LINE ─── */}
      <div className="w-full h-px border-t border-dashed border-slate-400 my-1" />

      {/* ─── BOTTOM SECTION: CONTROL STUB ─── */}
      <div className="border border-slate-400 rounded-xl overflow-hidden bg-white flex relative">
        <div className="flex-1 p-4 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <div>
              <span className="text-[8px] text-slate-400 font-bold uppercase block leading-none">Талон контроля / Control Coupon</span>
              <span className="text-sm font-extrabold text-slate-800 uppercase tracking-wide">{passengerName}</span>
            </div>
            <span className="text-[9px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded uppercase tracking-wider">
              {serviceClassLabel.split('/')[0]}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-[9px] text-slate-400 font-bold uppercase block">Маршрут / Route</span>
              <span className="text-xs font-bold text-slate-800">{ticket.fromCity} ({ticket.from}) → {ticket.toCity} ({ticket.to})</span>
            </div>
            <div>
              <span className="text-[9px] text-slate-400 font-bold uppercase block">Рейс / Flight</span>
              <span className="text-xs font-bold text-slate-800">{ticket.flightNumber}</span>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2 pt-3 border-t border-slate-200">
            <div>
              <span className="text-[8px] text-slate-400 font-bold uppercase block">Место</span>
              <span className="text-sm font-black text-slate-800">{seatId}</span>
            </div>
            <div>
              <span className="text-[8px] text-slate-400 font-bold uppercase block">Выход</span>
              <span className="text-sm font-extrabold text-slate-800">A08</span>
            </div>
            <div>
              <span className="text-[8px] text-slate-400 font-bold uppercase block">Посадка</span>
              <span className="text-sm font-extrabold text-slate-800">{boardingTime}</span>
            </div>
            <div>
              <span className="text-[8px] text-slate-400 font-bold uppercase block">Дата</span>
              <span className="text-xs font-bold text-slate-700">15.06.26</span>
            </div>
          </div>
        </div>

        {/* Vertical stub barcode */}
        <div className="w-16 border-l border-slate-200 flex flex-col items-center justify-center py-4 px-2 bg-slate-50/50 print:bg-white flex-shrink-0">
          <div className="h-28 w-7 flex items-center justify-center overflow-hidden">
            <BarcodeVertical />
          </div>
          <p className="text-[7px] font-mono text-slate-500 tracking-widest mt-2.5 uppercase rotate-90 origin-center select-none whitespace-nowrap">
            {ticket.from} {ticket.to}
          </p>
        </div>
      </div>
      
    </div>
  );
}
