import type { ApiEntity } from '@/core/api/api.types'
import type { IRichText } from '@/core/utils/richtext.utils'

/**
 * Represents the solve status of an assigned work.
 */
export type SolveStatus = 'not-solved' | 'in-progress' | 'solved'

/**
 * Represents the check status of an assigned work.
 */
export type CheckStatus = 'not-checked' | 'in-progress' | 'checked'

/**
 * Detailed information about deadline shifts for an assigned work.
 */
export type DeadlineShiftHistory = {
  shiftedAt: Date
  shiftedBy: 'student' | 'mentor'
  reason: string
}

/**
 * Used to give points for parts of the taks.
 * For example:
 * ```json
 * {
 *  "spellcheck": 5,
 *  "grammar": 10
 * }
 * ```
 */
export type DetailedScore = Record<string, number>

/**
 * Shows all the information about the progress of the assigned work.
 */
export interface AssignedWorkProgress {
  solveStatus: SolveStatus
  solvedAt: Date | null
  checkStatus: CheckStatus
  checkedAt: Date | null
  score: number | null
  maxScore: number
}

/**
 * Options to remake an assigned work.
 */
export type AssignedWorkRemakeOptions = {
  includeOnlyFailedTasks?: boolean
}

/**
 * Options to add a mentor to an assigned work.
 * If `notify` is true, the new mentor will be notified about the assignment.
 */
export type AssignedWorkAddMentorOptions = {
  notify: boolean
}

export interface AssignedWorkEntity extends ApiEntity {
  title: string
  type: WorkType
  attempt: number
  solveStatus: SolveStatus
  solveDeadlineAt: Date | null
  solveDeadlineShiftHistory: DeadlineShiftHistory | null
  solvedAt: Date | null
  checkStatus: CheckStatus
  checkedDeadlineAt: Date | null
  checkedDeadlineShiftHistory: DeadlineShiftHistory | null
  checkedAt: Date | null
  score: number | null
  maxScore: number
  isArchivedByStudent: boolean
  isArchivedByMentors: boolean
  isArchivedByAssistants: boolean
  excludedTaskIds: string[]
  studentComment?: AssignedWorkCommentEntity | null
  mentorComments?: AssignedWorkCommentEntity | null
  student?: UserEntity
  mainMentor?: UserEntity | null
  helperMentor?: UserEntity | null
  work?: WorkEntity | null
  answers?: AssignedWorkAnswerEntity[]
}

export interface AssignedWorkCommentEntity extends ApiEntity {
  content: IRichText | null
  type: 'student' | 'mentor'
}

export interface AssignedWorkAnswerEntity extends ApiEntity {
  richTextContent: IRichText | null
  wordContent: string | null
  taskId: string
  mentorComment: IRichText | null
  score: number | null
  detailedScore: DetailedScore | null
  maxScore: number
}
