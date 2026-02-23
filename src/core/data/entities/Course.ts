import type { Entity } from '../Entity'
import type { Chapter } from './Chapter'
import type { CourseAssignment } from './CourseAssignment'
import type { Media } from './Media'
import type { Subject } from './Subject'
import type { User } from './User'

export interface Course extends Entity {
  slug: string
  name: string
  images: Media[]
  authors: User[]
  editors: User[]
  description: string
  chapters: Chapter[]
  subject: Subject
  subjectId?: Subject['id']
  createdAt: Date
  updatedAt: Date
  studentAssignments?: CourseAssignment[]
  studentAssignmentIds?: CourseAssignment['id'][]
  studentCount?: number
}
