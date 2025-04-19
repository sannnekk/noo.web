function dateToIsoString(date: Date): string {
  return date.toISOString()
}

function isoStringToDate(isoString: string): Date {
  return new Date(isoString)
}

function tomorrow(): Date {
  const date = new Date()
  date.setDate(date.getDate() + 1)
  return date
}

function inDays(days: number): Date {
  const date = new Date()
  date.setDate(date.getDate() + days)
  return date
}

export default {
  dateToIsoString,
  isoStringToDate,
  tomorrow,
  inDays
}
