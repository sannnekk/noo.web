import type { Answer } from './Answer'
import type { User } from './User'
import type { Work } from './Work'
import type { Comment } from './Comment'

export interface AssignedWork {
  id: string
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
  solveDeadlineAt?: Date
  checkDeadlineAt?: Date
  solvedAt?: Date
  checkedAt?: Date
  answers: Answer[]
  answerIds: Answer['id'][]
  comments: Comment[]
  commentIds: Comment['id'][]
  score?: number
  maxScore: number
  isArchived: boolean
  createdAt: Date
  updatedAt: Date
}
