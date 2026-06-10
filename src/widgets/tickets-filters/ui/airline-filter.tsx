'use client';

import * as Checkbox from '@radix-ui/react-checkbox';
import { Check } from 'lucide-react';

interface AirlineFilterProps {
  airlines: string[];
  selected: string[];
  onToggle: (airline: string) => void;
}

export function AirlineFilter({
  airlines,
  selected,
  onToggle,
}: AirlineFilterProps) {
  return (
    <div>
      <h4 className="text-sm font-medium text-slate-700 mb-3">Авиакомпания</h4>
      <div className="space-y-2">
        {airlines.map((airline) => (
          <label
            key={airline}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <Checkbox.Root
              checked={selected.length === 0 || selected.includes(airline)}
              onCheckedChange={() => onToggle(airline)}
              className="
                flex h-4.5 w-4.5 items-center justify-center rounded
                border border-slate-300 bg-white
                transition-all duration-150
                data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600
                group-hover:border-blue-400
              "
            >
              <Checkbox.Indicator>
                <Check className="h-3 w-3 text-white" />
              </Checkbox.Indicator>
            </Checkbox.Root>
            <span className="text-sm text-slate-600 group-hover:text-slate-800 transition-colors">
              {airline}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}
