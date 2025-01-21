/**
 * Get the duration of a video in seconds
 */
export function getVideoDuration(file: File): number {
  switch (file.type) {
    case 'video/mp4':
      return getMp4Duration(file)
    case 'video/quicktime':
      return getQuicktimeDuration(file)
    default:
      throw new Error('Unsupported file type')
  }
}

function getMp4Duration(file: File): number {
  // This is a fake implementation
  return 100
}

function getQuicktimeDuration(file: File): number {
  // This is a fake implementation
  return 200
}

export function stringifyDuration(length: number) {
  const hours = Math.floor(length / 3600)
  const minutes = Math.floor((length % 3600) / 60)
  const seconds = length % 60

  return `${hours ? hours + ':' : ''}${minutes}:${seconds
    .toString()
    .padStart(2, '0')}`
}
