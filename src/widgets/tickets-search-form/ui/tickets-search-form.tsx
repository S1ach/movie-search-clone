'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { searchFormSchema, type SearchFormValues } from '../model/schema';
import { Button } from '@/shared/ui/button';
import { CityAutocomplete } from '@/shared/ui/city-autocomplete';
import { DatePicker } from '@/shared/ui/date-picker';
import { PassengerCounter } from '@/shared/ui/passenger-counter';
import { ServiceClassSelector } from '@/shared/ui/service-class-selector';
import { CITIES } from '@/entities/airport';
import { ArrowRightLeft, Search } from 'lucide-react';

interface TicketsSearchFormProps {
  onSearch: (values: SearchFormValues) => void;
  defaultValues?: Partial<SearchFormValues>;
  isLoading?: boolean;
}

export function TicketsSearchForm({
  onSearch,
  defaultValues,
  isLoading,
}: TicketsSearchFormProps) {
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<SearchFormValues>({
    resolver: zodResolver(searchFormSchema),
    defaultValues: {
      from: '',
      to: '',
      departureDate: '',
      returnDate: '',
      passengers: 1,
      serviceClass: 'economy',
      ...defaultValues,
    },
  });

  const fromValue = watch('from');
  const toValue = watch('to');

  const handleSwapCities = () => {
    setValue('from', toValue);
    setValue('to', fromValue);
  };

  return (
    <form
      onSubmit={handleSubmit(onSearch)}
      className="relative"
    >
      <div className="rounded-2xl bg-white border border-slate-200 shadow-lg shadow-slate-200/50 p-6 sm:p-8">
        {/* Row 1: Cities */}
        <div className="flex flex-col sm:flex-row items-start gap-3 mb-4">
          <div className="flex-1 w-full">
            <Controller
              name="from"
              control={control}
              render={({ field }) => (
                <CityAutocomplete
                  label="Откуда"
                  options={CITIES}
                  value={field.value}
                  onValueChange={field.onChange}
                  placeholder="Город вылета"
                  error={errors.from?.message}
                />
              )}
            />
          </div>

          <button
            type="button"
            onClick={handleSwapCities}
            className="
              flex-shrink-0 flex items-center justify-center
              h-10 w-10 rounded-full border border-slate-200
              text-slate-400 hover:text-blue-600 hover:border-blue-300
              hover:bg-blue-50 transition-all duration-200
              mt-6
            "
            title="Поменять местами"
          >
            <ArrowRightLeft className="h-4 w-4" />
          </button>

          <div className="flex-1 w-full">
            <Controller
              name="to"
              control={control}
              render={({ field }) => (
                <CityAutocomplete
                  label="Куда"
                  options={CITIES}
                  value={field.value}
                  onValueChange={field.onChange}
                  placeholder="Город прилёта"
                  error={errors.to?.message}
                />
              )}
            />
          </div>
        </div>

        {/* Row 2: Dates, passengers, class */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_140px_1.5fr] gap-3 mb-6">
          <Controller
            name="departureDate"
            control={control}
            render={({ field }) => (
              <DatePicker
                label="Туда"
                value={field.value}
                onChange={field.onChange}
                placeholder="Дата вылета"
                error={errors.departureDate?.message}
              />
            )}
          />

          <Controller
            name="returnDate"
            control={control}
            render={({ field }) => (
              <DatePicker
                label="Обратно"
                value={field.value || ''}
                onChange={field.onChange}
                placeholder="Необязательно"
              />
            )}
          />

          <Controller
            name="passengers"
            control={control}
            render={({ field }) => (
              <PassengerCounter
                label="Пассажиры"
                value={field.value}
                onChange={field.onChange}
                min={1}
                max={9}
                error={errors.passengers?.message}
              />
            )}
          />

          <Controller
            name="serviceClass"
            control={control}
            render={({ field }) => (
              <ServiceClassSelector
                label="Класс"
                value={field.value}
                onChange={field.onChange}
                error={errors.serviceClass?.message}
              />
            )}
          />
        </div>

        {/* Submit */}
        <Button
          type="submit"
          size="lg"
          isLoading={isLoading}
          className="w-full sm:w-auto sm:min-w-[200px] sm:mx-auto sm:flex"
        >
          <Search className="h-4 w-4" />
          Найти билеты
        </Button>
      </div>
    </form>
  );
}
