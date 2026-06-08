import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { SearchTicketsParams, ServiceClass } from '@/entities/ticket';

interface SearchTicketsState {
  params: SearchTicketsParams;
  hasSearched: boolean;
}

const initialState: SearchTicketsState = {
  params: {
    from: '',
    to: '',
    departureDate: '',
    returnDate: undefined,
    passengers: 1,
    serviceClass: 'economy' as ServiceClass,
  },
  hasSearched: false,
};

export const searchTicketsSlice = createSlice({
  name: 'searchTickets',
  initialState,
  reducers: {
    setSearchParams(state, action: PayloadAction<SearchTicketsParams>) {
      state.params = action.payload;
      state.hasSearched = true;
    },
    resetSearch(state) {
      state.params = initialState.params;
      state.hasSearched = false;
    },
  },
});

export const { setSearchParams, resetSearch } = searchTicketsSlice.actions;
export const searchTicketsReducer = searchTicketsSlice.reducer;
