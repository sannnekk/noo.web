import type { AssignedWork } from '@/core/data/entities/AssignedWork'
import type { Task } from '@/core/data/entities/Task'
import type { AssignedWorkViewMode } from '../types/AssignedWorkViewMode'
import type { Answer } from '@/core/data/entities/Answer'
import type { Comment } from '@/core/data/entities/Comment'
import { Core } from '@/core/Core'
import {
  deltasAreEqual,
  isDeltaEmptyOrWhitespace
} from '@/core/utils/deltaHelpers'

export function hasCriteria(taskType: Task['type']): boolean {
  return taskType === 'essay' || taskType === 'final-essay'
}

export function scoreFromDetailedScore(detailedScore: Record<string, number>) {
  return Object.values(detailedScore).reduce((acc, score) => acc + score, 0)
}

export function isCheckedAutomatically(taskType: Task['type']) {
  return taskType === 'word'
}

export function getTaskScoreStatus(
  task: Task,
  assignedWork: AssignedWork,
  mode: AssignedWorkViewMode
): 'warning' | 'success' | 'error' | null {
  if (
    mode === 'solve' ||
    !isWorkMade(assignedWork) ||
    (Core.Context.roleIs(['admin', 'teacher', 'student', 'assistant']) &&
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
    Core.Context.roleIs(['admin', 'teacher', 'student', 'assistant'])
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

export function getChangedAnswer(
  answers: Answer[],
  savedAnswer: Record<Answer['id'], Answer>
): Answer | null {
  return (
    answers
      .filter((answer) => {
        return !(isDeltaEmptyOrWhitespace(answer.content) && !answer.word)
      })
      .find((answer) => {
        const saved = savedAnswer[answer.id]
        return (
          !saved ||
          !deltasAreEqual(saved.content, answer.content) ||
          saved.word !== answer.word
        )
      }) || null
  )
}

export function getChangedComment(
  comments: Comment[],
  savedComments: Record<Comment['id'], Comment>
): Comment | null {
  return (
    comments
      .filter((comment) => {
        return !isDeltaEmptyOrWhitespace(comment.content) || comment.score > 0
      })
      .find((comment) => {
        const saved = savedComments[comment.id]
        return JSON.stringify(comment) !== JSON.stringify(saved)
      }) || null
  )
}
