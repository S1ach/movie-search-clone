import { type ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export function Card({ children, className = '', hover = false }: CardProps) {
  return (
    <div
      className={`
        rounded-2xl border border-slate-100 bg-white
        shadow-sm shadow-slate-100
        ${hover ? 'transition-all duration-300 hover:shadow-md hover:shadow-slate-200/50 hover:border-slate-200 hover:-translate-y-0.5' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
