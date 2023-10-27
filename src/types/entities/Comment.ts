import type { DeltaContentType } from '../composed/DeltaContentType'
import type { Task } from './Task'

export interface Comment {
  id: string
  slug: string
  content: DeltaContentType
  score: number
  task?: Task
  taskId: Task['id']
  createdAt: Date
  updatedAt: Date
}
