export const Constants = {
  API_URL:
    import.meta.env.MODE === 'production'
      ? 'http://www.api.noo-school.ru'
      : 'http://localhost:3000',
  MEDIA_URL: 'https://www.cdn.noo-school.ru/uploads'
} as const
