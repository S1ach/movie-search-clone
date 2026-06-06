export interface Ticket {
  id: string;
  airline: string;
  airlineLogo: string;
  flightNumber: string;
  from: string;
  fromCity: string;
  to: string;
  toCity: string;
  cityImage: string;
  departureTime: string;
  arrivalTime: string;
  durationMinutes: number;
  stops: number;
  stopCities: string[];
  price: number;
  currency: string;
  baggageIncluded: boolean;
  serviceClass: ServiceClass;
}

export type ServiceClass = 'economy' | 'comfort' | 'business' | 'first';

export interface SearchTicketsParams {
  from: string;
  to: string;
  departureDate: string;
  returnDate?: string;
  passengers: number;
  serviceClass: ServiceClass;
}

export interface SearchTicketsResponse {
  tickets: Ticket[];
  total: number;
}

export type SortOption = 'price_asc' | 'duration_asc' | 'optimal';

export interface TicketFilters {
  maxPrice: number | null;
  minPrice: number | null;
  airlines: string[];
  maxStops: number | null;
  departureTimeFrom: string | null;
  departureTimeTo: string | null;
}
