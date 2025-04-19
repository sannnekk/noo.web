import type { Material } from './Material'
import type { Course } from './Course'
import type { Entity } from '../Entity'

export interface Chapter extends Entity {
  name: string
  slug: string
  courseId: string
  course?: Course
  chapters?: Chapter[]
  materials?: Material[]
  order: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}
