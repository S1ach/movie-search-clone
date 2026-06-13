import { NextRequest, NextResponse } from 'next/server';
import { serverEnv } from '@/shared/config/env';
import type { TravelpayoutsTicket } from '@/entities/ticket/lib/mapTravelpayoutsResponse';
import {
  mapTravelpayoutsTickets,
  AIRPORT_TO_CITY_CODE,
} from '@/entities/ticket/lib/mapTravelpayoutsResponse';
import { TICKETS_MOCK } from '@/entities/ticket/mocks/tickets.mock';
import type { ServiceClass } from '@/entities/ticket/types/ticket';

const TRAVELPAYOUTS_BASE = 'https://api.travelpayouts.com/aviasales/v3/prices_for_dates';

/**
 * GET /api/tickets/search?from=SVO&to=LED&departureDate=2025-07-01
 *
 * Если TRAVELPAYOUTS_TOKEN настроен → реальные данные от Travelpayouts.
 * Если нет → отдаёт mock-данные (работает без ключа).
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  const from = searchParams.get('from') || '';
  const to = searchParams.get('to') || '';
  const departureDate = searchParams.get('departureDate') || '';
  const returnDate = searchParams.get('returnDate') || '';
  const serviceClass = (searchParams.get('serviceClass') || 'economy') as ServiceClass;

  const token = serverEnv.TRAVELPAYOUTS_TOKEN;
  const hasValidToken = token && token !== 'ваш_ключ_сюда' && token.length > 5;

  // ─── Без ключа → mock-данные ───
  if (!hasValidToken) {
    // Имитируем задержку сети
    await new Promise((resolve) => setTimeout(resolve, 300 + Math.random() * 500));

    const filtered = TICKETS_MOCK.filter((ticket) => {
      const fromMatch = !from || ticket.from === from;
      const toMatch = !to || ticket.to === to;
      return fromMatch && toMatch;
    });

    return NextResponse.json({
      tickets: filtered,
      total: filtered.length,
      source: 'mock',
    });
  }

  // ─── С ключом → реальное API Travelpayouts ───
  if (!from || !to) {
    return NextResponse.json(
      { error: 'Параметры from и to обязательны' },
      { status: 400 }
    );
  }

  const originCity = AIRPORT_TO_CITY_CODE[from] || from;
  const destinationCity = AIRPORT_TO_CITY_CODE[to] || to;

  const params = new URLSearchParams({
    origin: originCity,
    destination: destinationCity,
    token,
    sorting: 'price',
    limit: '30',
    unique: 'false',
  });

  if (departureDate) params.set('departure_at', departureDate);
  if (returnDate) params.set('return_at', returnDate);
  if (serviceClass === 'business' || serviceClass === 'first') {
    params.set('trip_class', '1');
  }

  try {
    const response = await fetch(`${TRAVELPAYOUTS_BASE}?${params.toString()}`, {
      headers: { Accept: 'application/json' },
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      console.error('[Travelpayouts] Error:', response.status);
      // Fallback на моки при ошибке API
      const filtered = TICKETS_MOCK.filter((t) => {
        return (!from || t.from === from) && (!to || t.to === to);
      });
      return NextResponse.json({
        tickets: filtered,
        total: filtered.length,
        source: 'mock-fallback',
      });
    }

    const data = await response.json() as { data: TravelpayoutsTicket[]; success: boolean };

    if (!data.success || !data.data || data.data.length === 0) {
      // Нет результатов от API → пробуем моки
      const filtered = TICKETS_MOCK.filter((t) => {
        return (!from || t.from === from) && (!to || t.to === to);
      });
      return NextResponse.json({
        tickets: filtered,
        total: filtered.length,
        source: filtered.length > 0 ? 'mock-fallback' : 'empty',
      });
    }

    const tickets = mapTravelpayoutsTickets(data.data, serviceClass);

    return NextResponse.json({
      tickets,
      total: tickets.length,
      source: 'travelpayouts',
    });
  } catch (error) {
    console.error('[Travelpayouts] Fetch error:', error);
    const filtered = TICKETS_MOCK.filter((t) => {
      return (!from || t.from === from) && (!to || t.to === to);
    });
    return NextResponse.json({
      tickets: filtered,
      total: filtered.length,
      source: 'mock-fallback',
    });
  }
}
