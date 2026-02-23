import type { Entity } from '../Entity'
import type { User } from './User'

export interface VideoComment extends Entity {
  text: string
  videoId: string
  user?: User
  createdAt: Date
  updatedAt: Date
}
