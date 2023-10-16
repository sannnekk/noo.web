import type { Task } from './Task'

export interface TaskOption {
  id: string
  name: string
  isCorrect: boolean
  taskId: string
  task?: Task
}
