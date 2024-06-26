import type { Entity } from '../Entity'
import type { Chapter } from './Chapter'
import type { Media } from './Media'
import type { User } from './User'

export interface Course extends Entity {
  slug: string
  name: string
  images: Media[]
  author?: User
  authorId: User['id']
  description: string
  chapters?: Chapter[]
  students?: User[]
  studentIds?: User['id'][]
  createdAt: Date
  updatedAt: Date
}
