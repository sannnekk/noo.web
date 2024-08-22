import type { DeltaContentType } from '../../../types/composed/DeltaContentType'
import type { Entity } from '../Entity'
import type { Task } from './Task'

export interface Answer extends Entity {
  slug: string
  content?: DeltaContentType
  word?: string
  task?: Task
  taskId: Task['id']
  createdAt: Date
  updatedAt: Date
}
