export const Constants = {
  API_URL:
    import.meta.env.MODE === 'production'
      ? 'https://api.noo-school.ru'
      : 'http://localhost:3000',
  MEDIA_URL: 'https://cdn.noo-school.ru/uploads'
} as const
