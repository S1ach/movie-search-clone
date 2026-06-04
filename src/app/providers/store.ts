import { configureStore } from '@reduxjs/toolkit';
import { baseApi } from '@/shared/api';
import { searchTicketsReducer } from '@/features/search-tickets';
import { filterTicketsReducer } from '@/features/filter-tickets';
import { favoritesReducer } from '@/features/favorites';

export const makeStore = () =>
  configureStore({
    reducer: {
      [baseApi.reducerPath]: baseApi.reducer,
      searchTickets: searchTicketsReducer,
      filterTickets: filterTicketsReducer,
      favorites: favoritesReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(baseApi.middleware),
  });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
