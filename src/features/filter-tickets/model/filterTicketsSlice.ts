import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { TicketFilters } from '@/entities/ticket';

const initialState: TicketFilters = {
  maxPrice: null,
  minPrice: null,
  airlines: [],
  maxStops: null,
  departureTimeFrom: null,
  departureTimeTo: null,
};

export const filterTicketsSlice = createSlice({
  name: 'filterTickets',
  initialState,
  reducers: {
    setPriceRange(
      state,
      action: PayloadAction<{ min: number | null; max: number | null }>
    ) {
      state.minPrice = action.payload.min;
      state.maxPrice = action.payload.max;
    },
    setAirlines(state, action: PayloadAction<string[]>) {
      state.airlines = action.payload;
    },
    toggleAirline(state, action: PayloadAction<string>) {
      const idx = state.airlines.indexOf(action.payload);
      if (idx >= 0) {
        state.airlines.splice(idx, 1);
      } else {
        state.airlines.push(action.payload);
      }
    },
    setMaxStops(state, action: PayloadAction<number | null>) {
      state.maxStops = action.payload;
    },
    setDepartureTime(
      state,
      action: PayloadAction<{ from: string | null; to: string | null }>
    ) {
      state.departureTimeFrom = action.payload.from;
      state.departureTimeTo = action.payload.to;
    },
    resetFilters() {
      return initialState;
    },
  },
});

export const {
  setPriceRange,
  setAirlines,
  toggleAirline,
  setMaxStops,
  setDepartureTime,
  resetFilters,
} = filterTicketsSlice.actions;
export const filterTicketsReducer = filterTicketsSlice.reducer;
