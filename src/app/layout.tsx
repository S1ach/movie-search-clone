import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { StoreProvider } from './providers/store-provider';
import { Header } from '@/widgets/header';

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
});

export const metadata: Metadata = {
  title: 'AeroSearch — Поиск авиабилетов',
  description:
    'Найдите и сравните лучшие авиабилеты. Поиск рейсов по всем направлениям, сравнение цен и бронирование.',
  keywords: ['авиабилеты', 'поиск билетов', 'перелёты', 'рейсы', 'бронирование'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={`${inter.className} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900" suppressHydrationWarning>
        <StoreProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <footer className="border-t border-slate-100 bg-white py-6">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <p className="text-center text-xs text-slate-400">
                © {new Date().getFullYear()} AeroSearch. Демо-проект поиска авиабилетов.
              </p>
            </div>
          </footer>
        </StoreProvider>
      </body>
    </html>
  );
}
