export function formatPrice(price: number, currency = '₽'): string {
  return `${price.toLocaleString('ru-RU')} ${currency}`;
}
