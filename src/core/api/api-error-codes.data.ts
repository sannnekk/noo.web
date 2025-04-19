const ApiErrorCodes: Record<
  string,
  {
    name: string
    description: string
  }
> = {
  UNKNOWN_ERROR: {
    name: 'Неизвестная ошибка',
    description: 'Попробуйте позже или проверьте подключение к интернету'
  },
  NETWORK_ERROR: {
    name: 'Ошибка соединения с сервером',
    description: 'Проверьте подключение к интернету'
  },
  NOT_FOUND: {
    name: 'Не найдено',
    description: 'Запрашиваемый ресурс не найден'
  },
  FORBIDDEN: {
    name: 'Доступ запрещен',
    description: 'У вас нет прав доступа к этому ресурсу'
  },
  UNAUTHORIZED: {
    name: 'Запрос не авторизован',
    description: 'Пожалуйста, войдите в систему, чтобы продолжить'
  },
  BAD_REQUEST: {
    name: 'Некорректный запрос',
    description: 'Проверьте правильность введенных данных'
  },
  SERVER_ERROR: {
    name: 'Ошибка сервера',
    description: 'Попробуйте позже или свяжитесь с поддержкой'
  },
  fallback: {
    name: 'Неизвестная ошибка',
    description: 'Попробуйте позже или проверьте подключение к интернету'
  }
} as const

export { ApiErrorCodes }
