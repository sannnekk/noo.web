import { useI18n } from 'vue-i18n'

interface Options {
  precision: 'year' | 'month' | 'day'
}

export function useDate(date: Date, options?: Options) {
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
    const i18n = useI18n()
    const _date = useDate(date)

    if (_date.isToday()) return i18n.t('composables.date.today')

    if (_date.isYesterday()) return i18n.t('composables.date.yesterday')

    if (options?.precision === 'day' && _date.isInThisYear())
      return `${date.getDate()} ${i18n.t('composables.date.months.' + date.getMonth())}`

    if (options?.precision === 'day' && !_date.isInThisYear())
      return `${date.getDate()} ${i18n.t(
        'composables.date.months.' + date.getMonth()
      )} ${date.getFullYear()}`

    if (_date.isOnLastWeek()) return i18n.t('composables.date.thisWeek')

    if (_date.isInThisMonth()) return i18n.t('composables.date.thisMonth')

    if (_date.isInThisYear()) return i18n.t('composables.date.months.' + date.getMonth())

    return date.getFullYear().toString()
  }

  return {
    isOnSameDay,
    isOnLastWeek,
    isInThisMonth,
    isToday,
    isYesterday,
    isInThisYear,
    toBeautiful,
    daysDifference,
    isOnThisWeek
  }
}
