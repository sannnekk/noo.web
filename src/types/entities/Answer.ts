import type { DeltaContentType } from '../composed/DeltaContentType'
import type { Task } from './Task'
import type { TaskOption } from './TaskOption'

export interface Answer {
  id: string
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
