import type { SearchTicketsParams, ServiceClass } from '@/entities/ticket';

export function searchParamsToQuery(params: SearchTicketsParams): string {
  const query = new URLSearchParams();

  if (params.from) query.set('from', params.from);
  if (params.to) query.set('to', params.to);
  if (params.departureDate) query.set('date', params.departureDate);
  if (params.returnDate) query.set('return', params.returnDate);
  if (params.passengers) query.set('pax', String(params.passengers));
  if (params.serviceClass) query.set('class', params.serviceClass);

  return query.toString();
}

export function queryToSearchParams(
  searchParams: URLSearchParams
): SearchTicketsParams {
  return {
    from: searchParams.get('from') || '',
    to: searchParams.get('to') || '',
    departureDate: searchParams.get('date') || '',
    returnDate: searchParams.get('return') || undefined,
    passengers: Number(searchParams.get('pax')) || 1,
    serviceClass: (searchParams.get('class') as ServiceClass) || 'economy',
  };
}
