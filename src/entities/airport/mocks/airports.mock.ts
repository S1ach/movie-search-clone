import type { Airport } from '../types/airport';

export const AIRPORTS_MOCK: Airport[] = [
  { code: 'SVO', name: 'Шереметьево', city: 'Москва' },
  { code: 'DME', name: 'Домодедово', city: 'Москва' },
  { code: 'VKO', name: 'Внуково', city: 'Москва' },
  { code: 'LED', name: 'Пулково', city: 'Санкт-Петербург' },
  { code: 'AER', name: 'Сочи', city: 'Сочи' },
  { code: 'KZN', name: 'Казань', city: 'Казань' },
  { code: 'SVX', name: 'Кольцово', city: 'Екатеринбург' },
  { code: 'OVB', name: 'Толмачёво', city: 'Новосибирск' },
  { code: 'KRR', name: 'Пашковский', city: 'Краснодар' },
  { code: 'ROV', name: 'Платов', city: 'Ростов-на-Дону' },
  { code: 'UFA', name: 'Уфа', city: 'Уфа' },
  { code: 'KGD', name: 'Храброво', city: 'Калининград' },
  { code: 'MRV', name: 'Минеральные Воды', city: 'Минеральные Воды' },
  { code: 'TJM', name: 'Рощино', city: 'Тюмень' },
  { code: 'VVO', name: 'Кневичи', city: 'Владивосток' },
];

export const CITIES = AIRPORTS_MOCK.map((a) => ({
  value: a.code,
  label: `${a.city} (${a.code})`,
}));
