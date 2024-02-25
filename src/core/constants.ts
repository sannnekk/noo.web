export const Constants = {
  API_URL:
    process.env.NODE_ENV === 'production'
      ? 'https://api.noo-school.ru'
      : 'http://localhost:3000',
  MEDIA_URL: 'https://cdn.noo-school.ru/uploads'
} as const
