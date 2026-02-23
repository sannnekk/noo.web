import type { Entity } from '../Entity'
import type { Answer } from './Answer'
import type { Comment } from './Comment'
import type { Task } from './Task'

export interface FavouriteTask extends Entity {
  task?: Task
  answer: Answer | null
  comment: Comment | null
}
