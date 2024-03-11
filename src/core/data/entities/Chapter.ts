import type { Material } from './Material'
import type { Course } from './Course'

export interface Chapter {
  id: string
  name: string
  slug: string
  courseId: string
  course?: Course
  materials?: Material[]
  order: number
  createdAt: Date
  updatedAt: Date
}
