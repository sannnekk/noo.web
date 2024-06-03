import type { DeltaContentType } from '../../../types/composed/DeltaContentType'
import type { Entity } from '../Entity'
import type { Task } from './Task'
import type { TaskOption } from './TaskOption'

export interface Answer extends Entity {
  slug: string
  content?: DeltaContentType
  word?: string
  chosenTaskOptions?: TaskOption[]
  chosenTaskOptionIds?: TaskOption['id'][]
  task?: Task
  taskId: Task['id']
  createdAt: Date
  updatedAt: Date
}
