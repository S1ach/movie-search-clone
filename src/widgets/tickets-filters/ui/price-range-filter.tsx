'use client';

import * as SliderPrimitive from '@radix-ui/react-slider';
import { formatPrice } from '@/entities/ticket';

interface PriceRangeFilterProps {
  min: number;
  max: number;
  currentMin: number | null;
  currentMax: number | null;
  onChange: (min: number | null, max: number | null) => void;
}

export function PriceRangeFilter({
  min,
  max,
  currentMin,
  currentMax,
  onChange,
}: PriceRangeFilterProps) {
  const effectiveMin = currentMin ?? min;
  const effectiveMax = currentMax ?? max;

  return (
    <div>
      <h4 className="text-sm font-medium text-slate-700 mb-3">Цена</h4>
      <SliderPrimitive.Root
        className="relative flex w-full touch-none select-none items-center h-5"
        value={[effectiveMin, effectiveMax]}
        min={min}
        max={max}
        step={100}
        onValueChange={([newMin, newMax]) => {
          onChange(
            newMin === min ? null : newMin,
            newMax === max ? null : newMax
          );
        }}
      >
        <SliderPrimitive.Track className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-slate-200">
          <SliderPrimitive.Range className="absolute h-full bg-blue-500" />
        </SliderPrimitive.Track>
        <SliderPrimitive.Thumb className="block h-5 w-5 rounded-full border-2 border-blue-500 bg-white shadow-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/30 hover:border-blue-600 cursor-grab active:cursor-grabbing" />
        <SliderPrimitive.Thumb className="block h-5 w-5 rounded-full border-2 border-blue-500 bg-white shadow-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/30 hover:border-blue-600 cursor-grab active:cursor-grabbing" />
      </SliderPrimitive.Root>
      <div className="flex items-center justify-between mt-2">
        <span className="text-xs text-slate-500">
          {formatPrice(effectiveMin)}
        </span>
        <span className="text-xs text-slate-500">
          {formatPrice(effectiveMax)}
        </span>
      </div>
    </div>
  );
}
