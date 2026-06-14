import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Ticket } from '@/entities/ticket';

interface FavoritesState {
  items: Ticket[];
  isLoaded: boolean;
  isDrawerOpen: boolean;
}

const initialState: FavoritesState = {
  items: [],
  isLoaded: false,
  isDrawerOpen: false,
};

export const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    loadFavorites(state) {
      if (typeof window !== 'undefined') {
        try {
          const stored = localStorage.getItem('favorites');
          if (stored) {
            state.items = JSON.parse(stored);
          }
        } catch (e) {
          console.error('Failed to load favorites from localStorage', e);
        }
      }
      state.isLoaded = true;
    },
    toggleFavorite(state, action: PayloadAction<Ticket>) {
      const ticket = action.payload;
      const index = state.items.findIndex((item) => item.id === ticket.id);
      if (index >= 0) {
        state.items.splice(index, 1);
      } else {
        state.items.push(ticket);
      }
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('favorites', JSON.stringify(state.items));
        } catch (e) {
          console.error('Failed to save favorites to localStorage', e);
        }
      }
    },
    setIsDrawerOpen(state, action: PayloadAction<boolean>) {
      state.isDrawerOpen = action.payload;
    },
  },
});

export const { loadFavorites, toggleFavorite, setIsDrawerOpen } = favoritesSlice.actions;
export const favoritesReducer = favoritesSlice.reducer;
