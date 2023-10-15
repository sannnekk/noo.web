import type { Chapter } from './Chapter'
import type { User } from './User'

export interface Course {
  id: string
  slug: string
  name: string
  image: string
  author: Partial<User>
  description: string
  chapters?: Chapter[]
  createdAt: Date
  updatedAt: Date
}
