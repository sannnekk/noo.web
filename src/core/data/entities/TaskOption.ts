import type { Entity } from '../Entity'
import type { Task } from './Task'

export interface TaskOption extends Entity {
  name: string
  isCorrect: boolean
  taskId: string
  task?: Task
}
