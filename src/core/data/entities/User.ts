import type { Entity } from '../Entity'
import type { Course } from './Course'
import type { CourseAssignment } from './CourseAssignment'
import type { MentorAssignment } from './MentorAssignment'
import type { UserAvatar } from './UserAvatar'

export interface User extends Entity {
  slug: string
  role: 'admin' | 'teacher' | 'mentor' | 'student' | 'assistant'
  name: string
  username: string
  email: string
  newEmail?: string
  avatar?: UserAvatar
  courses?: Course[]
  courseAssignments?: CourseAssignment[]
  courseAssignmentIds?: CourseAssignment['id'][]
  courseAssignmentsAsAssigner?: CourseAssignment[]
  mentorAssignmentsAsMentor?: MentorAssignment[]
  mentorAssignmentsAsStudent?: MentorAssignment[]
  telegramUsername?: string
  telegramId?: string
  password?: string
  isBlocked: boolean
  forbidden?: number
  createdAt: Date
  updatedAt: Date
  verificationToken?: string
  telegramNotificationsEnabled: boolean
}

export interface UserWithOnlineStatus extends User {
  isOnline: boolean
  lastRequestAt: Date
  isLastRequestMobile: boolean
}
