import type { Entity } from '../Entity'
import type { Course } from './Course'
import type { Media } from './Media'

export interface User extends Entity {
  slug: string
  role: 'admin' | 'teacher' | 'mentor' | 'student'
  name: string
  username: string
  email: string
  newEmail?: string
  avatar?: Media
  avatarType?: 'telegram' | 'custom'
  mentor?: User
  courses?: Course[]
  students?: User[]
  telegramUsername?: string
  telegramId?: string
  telegramAvatarUrl?: string
  password?: string
  isBlocked: boolean
  forbidden?: number
  createdAt: Date
  updatedAt: Date
  verificationToken?: string
}

export interface UserWithOnlineStatus extends User {
  isOnline: boolean
  lastRequestAt: Date
  isLastRequestMobile: boolean
}
