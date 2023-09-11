import type { User } from './User'
import type { Work } from './Work'

export interface AssignedWork {
  id: string
  slug: string
  mentorIds: string[]
  mentors?: User[]
  studentId: string
  student?: User
  workId: string
  work?: Work
  deadlineAt: Date
  createdAt: Date
  updatedAt: Date
}
