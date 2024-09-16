import type { AssignedWork } from '@/core/data/entities/AssignedWork'
import type { Task } from '@/core/data/entities/Task'
import type { AssignedWorkViewMode } from '../types/AssignedWorkViewMode'
import { Core } from '@/core/Core'

export function hasCriteria(taskType: Task['type']): boolean {
  return taskType === 'essay' || taskType === 'final-essay'
}

export function scoreFromDetailedScore(detailedScore: Record<string, number>) {
  return Object.values(detailedScore).reduce((acc, score) => acc + score, 0)
}

export function isCheckedAutomatically(taskType: Task['type']) {
  return taskType === 'final-essay'
}

export function getTaskScoreStatus(
  task: Task,
  assignedWork: AssignedWork,
  mode: AssignedWorkViewMode
): 'warning' | 'success' | 'error' | null {
  if (
    mode === 'solve' ||
    !isWorkMade(assignedWork) ||
    (Core.Context.roleIs(['admin', 'teacher', 'student']) &&
      !isWorkChecked(assignedWork))
  ) {
    return null
  }

  const comment = assignedWork.comments.find(
    (comment) => comment.taskId === task.id
  )

  if (!comment) {
    if (task.type !== 'text') {
      return 'error'
    }

    return null
  }

  if (
    !isWorkChecked(assignedWork) &&
    Core.Context.roleIs(['admin', 'teacher', 'student'])
  ) {
    return null
  }

  if (comment.score === 0) {
    return 'error'
  }
  if (comment.score === task.highestScore) {
    return 'success'
  }

  return 'warning'
}

export function isWorkChecked(assignedWork: AssignedWork) {
  return (
    assignedWork.checkStatus === 'checked-in-deadline' ||
    assignedWork.checkStatus === 'checked-after-deadline' ||
    assignedWork.checkStatus === 'checked-automatically'
  )
}

export function isWorkMade(assignedWork: AssignedWork) {
  return (
    assignedWork.solveStatus === 'made-in-deadline' ||
    assignedWork.solveStatus === 'made-after-deadline'
  )
}
