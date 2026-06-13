export interface AirlineInfo {
  name: string;
  logo: string;
  baggageIncluded: boolean;
}

/**
 * Словарь авиакомпаний по IATA-коду.
 * Используется для маппинга ответа Travelpayouts → наш формат.
 */
export const AIRLINES_DICT: Record<string, AirlineInfo> = {
  SU: { name: 'Аэрофлот', logo: '/airlines/aeroflot.svg', baggageIncluded: true },
  DP: { name: 'Победа', logo: '/airlines/pobeda.svg', baggageIncluded: false },
  S7: { name: 'S7 Airlines', logo: '/airlines/s7.svg', baggageIncluded: true },
  U6: { name: 'Уральские авиалинии', logo: '/airlines/ural.svg', baggageIncluded: true },
  UT: { name: 'UTair', logo: '/airlines/aeroflot.svg', baggageIncluded: true },
  N4: { name: 'Северный Ветер', logo: '/airlines/aeroflot.svg', baggageIncluded: true },
  FV: { name: 'Россия', logo: '/airlines/aeroflot.svg', baggageIncluded: true },
  '5N': { name: 'Smartavia', logo: '/airlines/aeroflot.svg', baggageIncluded: false },
  IO: { name: 'IrAero', logo: '/airlines/aeroflot.svg', baggageIncluded: true },
  Y7: { name: 'NordStar', logo: '/airlines/aeroflot.svg', baggageIncluded: true },
  A4: { name: 'Азимут', logo: '/airlines/aeroflot.svg', baggageIncluded: true },
  WZ: { name: 'Red Wings', logo: '/airlines/aeroflot.svg', baggageIncluded: true },
};

const FALLBACK_AIRLINE: AirlineInfo = {
  name: 'Авиакомпания',
  logo: '/airlines/aeroflot.svg',
  baggageIncluded: true,
};

export function getAirlineInfo(iataCode: string): AirlineInfo {
  return AIRLINES_DICT[iataCode] || { ...FALLBACK_AIRLINE, name: iataCode };
}
