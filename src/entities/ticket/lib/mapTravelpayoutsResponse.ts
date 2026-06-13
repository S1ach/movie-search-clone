import type { Ticket, ServiceClass } from '../types/ticket';
import { getAirlineInfo } from './airlinesDict';

/** Формат одного элемента ответа Travelpayouts v3/prices_for_dates */
export interface TravelpayoutsTicket {
  origin: string;
  destination: string;
  origin_airport: string;
  destination_airport: string;
  price: number;
  airline: string;
  flight_number: string;
  departure_at: string;
  return_at: string | null;
  transfers: number;
  duration: number;       // полная длительность в минутах (может быть 0)
  duration_to: number;    // длительность «туда» в минутах
  duration_back: number;  // длительность «обратно» в минутах
  link: string;
}

/** Маппинг IATA-кода аэропорта → город и картинка */
const AIRPORT_TO_CITY: Record<string, { city: string; image: string }> = {
  SVO: { city: 'Москва', image: '/cities/moscow.svg' },
  DME: { city: 'Москва', image: '/cities/moscow.svg' },
  VKO: { city: 'Москва', image: '/cities/moscow.svg' },
  ZIA: { city: 'Москва', image: '/cities/moscow.svg' },
  LED: { city: 'Санкт-Петербург', image: '/cities/saint-petersburg.png' },
  AER: { city: 'Сочи', image: '/cities/sochi.png' },
  KZN: { city: 'Казань', image: '/cities/kazan.png' },
  SVX: { city: 'Екатеринбург', image: '/cities/ekaterinburg.svg' },
  OVB: { city: 'Новосибирск', image: '/cities/novosibirsk.svg' },
  KRR: { city: 'Краснодар', image: '/cities/krasnodar.png' },
  ROV: { city: 'Ростов-на-Дону', image: '/cities/rostov.svg' },
  UFA: { city: 'Уфа', image: '/cities/ufa.svg' },
  KGD: { city: 'Калининград', image: '/cities/kaliningrad.png' },
  MRV: { city: 'Минеральные Воды', image: '/cities/mineralnye-vody.svg' },
  TJM: { city: 'Тюмень', image: '/cities/tyumen.svg' },
  VVO: { city: 'Владивосток', image: '/cities/vladivostok.svg' },
};

/** Маппинг IATA-кода города → код аэропорта (для Travelpayouts, где origin="MOW") */
export const CITY_TO_AIRPORTS: Record<string, string[]> = {
  MOW: ['SVO', 'DME', 'VKO'],
  LED: ['LED'],
  AER: ['AER'],
  KZN: ['KZN'],
  SVX: ['SVX'],
  OVB: ['OVB'],
  KRR: ['KRR'],
  ROV: ['ROV'],
  UFA: ['UFA'],
  KGD: ['KGD'],
  MRV: ['MRV'],
  TJM: ['TJM'],
  VVO: ['VVO'],
};

/** Маппинг кода аэропорта → IATA-код города для Travelpayouts */
export const AIRPORT_TO_CITY_CODE: Record<string, string> = {
  SVO: 'MOW', DME: 'MOW', VKO: 'MOW', ZIA: 'MOW',
  LED: 'LED', AER: 'AER', KZN: 'KZN', SVX: 'SVX',
  OVB: 'OVB', KRR: 'KRR', ROV: 'ROV', UFA: 'UFA',
  KGD: 'KGD', MRV: 'MRV', TJM: 'TJM', VVO: 'VVO',
};

function getCityInfo(airportCode: string): { city: string; image: string } {
  return AIRPORT_TO_CITY[airportCode] || { city: airportCode, image: '/cities/moscow.svg' };
}

function formatTime(isoString: string): string {
  try {
    const date = new Date(isoString);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  } catch {
    return '00:00';
  }
}

function computeArrivalTime(departureIso: string, durationMinutes: number): string {
  try {
    const dep = new Date(departureIso);
    const arr = new Date(dep.getTime() + durationMinutes * 60 * 1000);
    const hours = String(arr.getHours()).padStart(2, '0');
    const minutes = String(arr.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  } catch {
    return '00:00';
  }
}

export function mapTravelpayoutsTickets(
  raw: TravelpayoutsTicket[],
  serviceClass: ServiceClass = 'economy'
): Ticket[] {
  return raw.map((item, index) => {
    const airlineInfo = getAirlineInfo(item.airline);
    const fromInfo = getCityInfo(item.origin_airport);
    const toInfo = getCityInfo(item.destination_airport);
    const duration = item.duration_to || item.duration || 0;

    return {
      id: `tp-${index}-${item.flight_number}`,
      airline: airlineInfo.name,
      airlineLogo: airlineInfo.logo,
      flightNumber: `${item.airline} ${item.flight_number}`,
      from: item.origin_airport,
      fromCity: fromInfo.city,
      to: item.destination_airport,
      toCity: toInfo.city,
      cityImage: toInfo.image,
      departureTime: formatTime(item.departure_at),
      arrivalTime: duration > 0
        ? computeArrivalTime(item.departure_at, duration)
        : formatTime(item.departure_at),
      durationMinutes: duration,
      stops: item.transfers,
      stopCities: [], // Travelpayouts не отдаёт города пересадок
      price: item.price,
      currency: '₽',
      baggageIncluded: airlineInfo.baggageIncluded,
      serviceClass,
    };
  });
}
