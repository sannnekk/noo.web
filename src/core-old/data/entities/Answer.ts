import type { DeltaContentType } from '../../../types/richtext/DeltaContentType'
import type { Entity } from '../Entity'
import type { Task } from './Task'

export interface Answer extends Entity {
  slug: string
  content: DeltaContentType | null
  word: string | null
  task?: Task
  taskId: Task['id']
  createdAt: Date
  updatedAt: Date
}
