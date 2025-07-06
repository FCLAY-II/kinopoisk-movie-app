export const API_CONFIG = {
  KINOPOISK: {
    BASE_URL: process.env.NEXT_PUBLIC_KINOPOISK_BASE_URL,
    API_KEY: process.env.NEXT_PUBLIC_KINOPOISK_API_KEY,
  },
} as const;
