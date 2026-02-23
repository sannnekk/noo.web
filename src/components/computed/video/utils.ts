import type { User } from '@/core/data/entities/User'
import type { Video } from '@/core/data/entities/Video'

export function stringifyDuration(length: number) {
  const hours = Math.floor(length / 3600)
  const minutes = Math.floor((length % 3600) / 60)
  const seconds = length % 60

  return `${hours ? hours + ':' : ''}${minutes
    .toString()
    .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
}

export function videoVisibilityText(video: Video) {
  switch (video.accessType) {
    case 'everyone':
      return 'Доступно всем'
    case 'role':
      switch (video.accessValue as User['role']) {
        case 'admin':
          return 'Доступно администраторам'
        case 'teacher':
          return 'Доступно преподавателям'
        case 'mentor':
          return 'Доступно кураторам'
        case 'assistant':
          return 'Доступно ассистентам'
        case 'student':
          return 'Доступно ученикам'
      }
      break
    case 'mentorId':
      return 'Для учеников куратора'
    case 'courseId':
      return 'Для учеников курса'
  }
}
