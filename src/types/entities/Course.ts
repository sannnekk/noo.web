import type { Chapter } from './Chapter'
import type { Media } from './Media'
import type { User } from './User'

export interface Course {
  id: string
  slug: string
  name: string
  images: Media[]
  author: User
  authorId: User['id']
  description: string
  chapters?: Chapter[]
  students?: User[]
  createdAt: Date
  updatedAt: Date
}
