export function stringifyDuration(length: number) {
  const hours = Math.floor(length / 3600)
  const minutes = Math.floor((length % 3600) / 60)
  const seconds = length % 60

  return `${hours ? hours + ':' : ''}${minutes
    .toString()
    .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
}
