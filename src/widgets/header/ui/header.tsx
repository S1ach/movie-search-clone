'use client';

import { useEffect } from 'react';
import { Plane, Heart } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/app/providers/hooks';
import { loadFavorites, setIsDrawerOpen } from '@/features/favorites';

export function Header() {
  const dispatch = useAppDispatch();
  const favorites = useAppSelector((state) => state.favorites.items);

  // Load favorites from localStorage on initial mount
  useEffect(() => {
    dispatch(loadFavorites());
  }, [dispatch]);

  const handleOpenDrawer = () => {
    dispatch(setIsDrawerOpen(true));
  };

  return (
    <header className="sticky top-0 z-30 border-b border-slate-100 bg-white/80 backdrop-blur-lg">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <a href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 shadow-md shadow-blue-500/20 group-hover:shadow-lg group-hover:shadow-blue-500/30 transition-all duration-200">
              <Plane className="h-4.5 w-4.5 text-white" />
            </div>
            <span className="text-lg font-bold text-slate-800 tracking-tight">
              AeroSearch
            </span>
          </a>
          <nav className="flex items-center gap-6">
            <span className="hidden sm:inline text-sm text-slate-500">
              Поиск авиабилетов
            </span>
            <button
              type="button"
              onClick={handleOpenDrawer}
              className="
                relative flex items-center justify-center h-10 w-10 rounded-xl
                bg-slate-50 hover:bg-red-50 text-slate-500 hover:text-red-500
                border border-slate-100 hover:border-red-100
                transition-all duration-200 active:scale-95 cursor-pointer
              "
              title="Избранные билеты"
            >
              <Heart className={`h-5 w-5 ${favorites.length > 0 ? 'fill-red-500 text-red-500' : ''}`} />
              {favorites.length > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white animate-scale-in">
                  {favorites.length}
                </span>
              )}
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
}
