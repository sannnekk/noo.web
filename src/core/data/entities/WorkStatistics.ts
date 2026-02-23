import type { Task } from './Task'
import type { Work } from './Work'

export interface WorkStatistics {
  hardestTaskIds: { taskId: Task['id']; avgScore: number }[]
  averageWorkScore: {
    absolute: number
    percentage: number
  }
  medianWorkScore: {
    absolute: number
    percentage: number
  }
  workSolveCount: number
  work: Work
}
