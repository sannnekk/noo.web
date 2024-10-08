export const Constants = {
  API_URL:
    import.meta.env.MODE === 'production'
      ? 'https://api.noo-school.ru'
      : 'http://localhost:3000',
  MEDIA_URL:
    import.meta.env.MODE === 'production'
      ? 'https://cdn.noo-school.ru/uploads'
      : 'http://localhost:5500/uploads',
  APP_URL:
    import.meta.env.MODE === 'production'
      ? 'https://noo-school.ru'
      : 'http://localhost:5173',
  POLL_URL:
    import.meta.env.MODE === 'production'
      ? 'https://poll.noo-school.ru'
      : 'http://localhost:3001',
  GOOGLE_CLIENT_ID:
    '643513066461-h6vrkoirgj91vr2isaqsm7hrv6tbkml8.apps.googleusercontent.com'
} as const
