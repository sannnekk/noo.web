import type { Entity } from '../Entity'
import type { Subject } from './Subject'
import type { User } from './User'

export interface MentorAssignment extends Entity {
  mentor: User
  mentorId: User['id']
  student: User
  studentId: User['id']
  subject: Subject
  subjectId: Subject['id']
  updatedAt: Date
}
