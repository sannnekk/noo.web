import type { Task } from './Task'
import type { Work } from './Work'

export interface WorkStatistics {
  hardestTaskIds: { taskId: Task['id']; avgScore: number }[]
  averageWorkScore: number
  medianWorkScore: number
  workSolveCount: number
  work: Work
}
