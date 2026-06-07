import { z } from 'zod';

export const searchFormSchema = z
  .object({
    from: z.string().min(1, 'Выберите город вылета'),
    to: z.string().min(1, 'Выберите город прилёта'),
    departureDate: z.string().min(1, 'Укажите дату вылета'),
    returnDate: z.string().optional(),
    passengers: z
      .number({ error: 'Укажите число' })
      .min(1, 'Минимум 1 пассажир')
      .max(9, 'Максимум 9 пассажиров'),
    serviceClass: z.enum(['economy', 'comfort', 'business', 'first'], {
      error: 'Выберите класс обслуживания',
    }),
  })
  .refine((data) => data.from !== data.to, {
    message: 'Города вылета и прилёта должны отличаться',
    path: ['to'],
  });

export type SearchFormValues = z.infer<typeof searchFormSchema>;
