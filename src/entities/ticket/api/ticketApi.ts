import { baseApi } from '@/shared/api';
import type {
  SearchTicketsParams,
  SearchTicketsResponse,
} from '../types/ticket';

const ticketApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    searchTickets: builder.query<SearchTicketsResponse, SearchTicketsParams>({
      queryFn: async (params) => {
        try {
          const queryParams = new URLSearchParams({
            from: params.from,
            to: params.to,
          });

          if (params.departureDate) {
            queryParams.set('departureDate', params.departureDate);
          }
          if (params.returnDate) {
            queryParams.set('returnDate', params.returnDate);
          }
          if (params.serviceClass) {
            queryParams.set('serviceClass', params.serviceClass);
          }

          const response = await fetch(
            `/api/tickets/search?${queryParams.toString()}`
          );

          if (!response.ok) {
            const errorBody = await response.json().catch(() => ({}));
            return {
              error: {
                status: response.status,
                data: errorBody.error || `Ошибка API: ${response.status}`,
              },
            };
          }

          const data: SearchTicketsResponse = await response.json();
          return { data };
        } catch (error) {
          return {
            error: {
              status: 'FETCH_ERROR',
              error:
                error instanceof Error ? error.message : 'Неизвестная ошибка',
            },
          };
        }
      },
      providesTags: ['Tickets'],
    }),
  }),
});

export const { useSearchTicketsQuery, useLazySearchTicketsQuery } = ticketApi;
export { ticketApi };
