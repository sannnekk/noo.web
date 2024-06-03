export const Constants = {
  API_URL:
    import.meta.env.MODE === 'production'
      ? 'https://api.noo-school.ru'
      : 'http://localhost:3000',
  MEDIA_URL:
    import.meta.env.MODE === 'production'
      ? 'https://cdn.noo-school.ru/uploads'
      : 'file://C:\\Users\\nukle\\OneDrive\\projects\\noo\\web-2.0\\uploads'
} as const
