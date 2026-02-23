interface UseDateOptions {
  precision: 'year' | 'month' | 'day' | 'minute'
}

/* const months = [
  'Января',
  'Февраля',
  'Марта',
  'Апреля',
  'Мая',
  'Июня',
  'Июля',
  'Августа',
  'Сентября',
  'Октября',
  'Ноября',
  'Декабря'
] */

const monthNames = [
  'Январь',
  'Февраль',
  'Март',
  'Апрель',
  'Май',
  'Июнь',
  'Июль',
  'Август',
  'Сентярь',
  'Октябрь',
  'Ноябрь',
  'Декабрь'
]

export function useDate(date: Date, options?: UseDateOptions) {
  function today() {
    if (options?.precision === 'minute') {
      const d = new Date()
      d.setSeconds(59, 999)
      return d
    }

    if (options?.precision === 'day') {
      const d = new Date()
      d.setHours(23, 59, 59, 999)
      return d
    }

    if (options?.precision === 'month') {
      const d = new Date()
      d.setDate(1)
      d.setHours(23, 59, 59, 999)
      return d
    }

    if (options?.precision === 'year') {
      const d = new Date()
      d.setMonth(0, 1)
      d.setHours(23, 59, 59, 999)
      return d
    }

    return new Date()
  }

  function yesterday() {
    const now = today()

    now.setDate(now.getDate() - 1)
    now.setHours(0, 0, 1)

    return now
  }

  function isOnSameDay(d2: Date) {
    return (
      date.getDate() === d2.getDate() &&
      date.getMonth() === d2.getMonth() &&
      date.getFullYear() === d2.getFullYear()
    )
  }

  function isOnLastWeek() {
    const now = new Date()
    const lastWeek = new Date()

    lastWeek.setDate(now.getDate() - 7)

    return date > lastWeek
  }

  function isInThisMonth() {
    return date.getMonth() === new Date().getMonth()
  }

  function isToday() {
    return useDate(date).isOnSameDay(new Date())
  }

  function isYesterday() {
    const now = new Date()
    const yesterday = new Date()

    yesterday.setDate(now.getDate() - 1)

    return useDate(date).isOnSameDay(yesterday)
  }

  function isTomorrow() {
    const now = new Date()
    const tomorrow = new Date()

    tomorrow.setDate(now.getDate() + 1)

    return useDate(date).isOnSameDay(tomorrow)
  }

  function isInThisYear() {
    return date.getFullYear() === new Date().getFullYear()
  }

  function isOnThisWeek() {
    const now = new Date()
    const lastWeek = new Date()

    lastWeek.setDate(now.getDate() - 7)

    return date > lastWeek
  }

  function daysDifference(d2: Date) {
    const diffTime = Math.abs(date.getTime() - d2.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    return diffDays
  }

  function toBeautiful() {
    const _date = useDate(date)

    if (options?.precision === 'minute') {
      if (_date.isToday()) {
        const diff = Math.abs(date.getTime() - new Date().getTime())
        const diffMinutes = Math.ceil(diff / (1000 * 60))

        if (diffMinutes < 60) {
          switch (String(diffMinutes).padStart(2).charAt(1)) {
            case '0':
              return 'только что'
            case '1':
              return 'минуту назад'
            case '2':
            case '3':
            case '4':
              return `${diffMinutes} минуты назад`
            default:
              return `${diffMinutes} минут назад`
          }
        }

        return (
          'сегодня в ' +
          date.toLocaleTimeString('ru-RU', {
            hour: '2-digit',
            minute: '2-digit'
          })
        )
      }

      if (_date.isYesterday()) return 'вчера'

      if (_date.isTomorrow()) return 'завтра'

      return `${date.getDate() >= 10 ? date.getDate() : `0${date.getDate()}`}.${
        date.getMonth() + 1 >= 10
          ? date.getMonth() + 1
          : `0${date.getMonth() + 1}`
      }`
    }

    if (options?.precision === 'day' && _date.isInThisYear()) {
      if (_date.isToday()) return 'cегодня'

      if (_date.isYesterday()) return 'вчера'

      if (_date.isTomorrow()) return 'завтра'

      return `${date.getDate() >= 10 ? date.getDate() : `0${date.getDate()}`}.${
        date.getMonth() + 1 >= 10
          ? date.getMonth() + 1
          : `0${date.getMonth() + 1}`
      }`
    }

    if (options?.precision === 'day' && !_date.isInThisYear())
      return `${date.getDate() >= 10 ? date.getDate() : `0${date.getDate()}`}.${
        date.getMonth() + 1 >= 10
          ? date.getMonth() + 1
          : `0${date.getMonth() + 1}`
      }.${date.getFullYear()}`

    if (_date.isOnLastWeek()) return 'на этой неделе'

    if (_date.isInThisMonth()) return 'в этом месяце'

    if (_date.isInThisYear()) return monthNames[date.getMonth()]

    return date.getFullYear().toString()
  }

  return {
    isOnSameDay,
    isOnLastWeek,
    isInThisMonth,
    isToday,
    isYesterday,
    isTomorrow,
    isInThisYear,
    toBeautiful,
    daysDifference,
    isOnThisWeek,
    today,
    yesterday
  }
}
