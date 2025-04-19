import type { DeltaContentType } from '../../../types/richtext/DeltaContentType'
import type { Entity } from '../Entity'
import type { Task } from './Task'

export interface DetailedScore {
  [key: string]: number
}

export interface Comment extends Entity {
  slug: string
  content: DeltaContentType
  score: number
  detailedScore: DetailedScore | null
  task?: Task
  taskId: Task['id']
  createdAt: Date
  updatedAt: Date
}
