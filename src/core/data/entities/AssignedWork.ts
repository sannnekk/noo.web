import type { Answer } from './Answer'
import type { User } from './User'
import type { Work } from './Work'
import type { Comment } from './Comment'
import type { Entity } from '../Entity'
import type { DeltaContentType } from '@/types/composed/DeltaContentType'

export interface AssignedWorkProgress {
  solveStatus: AssignedWork['solveStatus']
  checkStatus: AssignedWork['checkStatus']
  score: AssignedWork['score'] | null
  maxScore: AssignedWork['maxScore']
}

export interface AssignedWork extends Entity {
  slug: string
  mentorIds: User['id'][]
  mentors?: User[]
  studentId: User['id']
  student?: User
  workId: Work['id']
  work?: Work
  solveStatus:
    | 'not-started'
    | 'in-progress'
    | 'made-in-deadline'
    | 'made-after-deadline'
  checkStatus:
    | 'not-checked'
    | 'in-progress'
    | 'checked-in-deadline'
    | 'checked-after-deadline'
    | 'checked-automatically'
  solveDeadlineAt: Date | null
  solveDeadlineShifted: boolean
  checkDeadlineAt: Date | null
  checkDeadlineShifted: boolean
  solvedAt: Date | null
  checkedAt: Date | null
  answers: Answer[]
  answerIds: Answer['id'][]
  comments: Comment[]
  commentIds: Comment['id'][]
  score: number | null
  maxScore: number
  isArchived: boolean
  studentComment: DeltaContentType | null
  mentorComment: DeltaContentType | null
  createdAt: Date
  updatedAt: Date
}
