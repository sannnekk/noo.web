import type { DeltaContentType } from '../../../types/composed/DeltaContentType'
import type { Entity } from '../Entity'
import type { Task } from './Task'

export interface Comment extends Entity {
  slug: string
  content: DeltaContentType
  score: number
  task?: Task
  taskId: Task['id']
  createdAt: Date
  updatedAt: Date
}
