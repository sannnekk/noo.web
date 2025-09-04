import type { Entity } from '../Entity'
import type { Course } from './Course'
import type { User } from './User'

export interface CourseAssignment extends Entity {
  course?: Course
  courseId: Course['id']
  student?: User
  studentId: User['id']
  assigner?: User
  assignerId: User['id']
  isArchived: boolean
	isPinned: boolean
  createdAt: Date
}
