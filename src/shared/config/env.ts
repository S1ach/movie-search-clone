export const env = {
  API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || '',
  USE_MOCK: process.env.NEXT_PUBLIC_USE_MOCK !== 'false', // default: true
} as const;

/** Server-only env (не используйте на клиенте) */
export const serverEnv = {
  TRAVELPAYOUTS_TOKEN: process.env.TRAVELPAYOUTS_TOKEN || '',
} as const;
