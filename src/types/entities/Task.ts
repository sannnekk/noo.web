import type { Answer } from './Answer'
import type { AssignedWork } from './AssignedWork'
import type { Comment } from './Comment'
import type { Work } from './Work'

export interface Task {
  id: string
  slug: string
  name: string
  content: string
  highestScore: number
  type: 'one_choice' | 'multiple_choice' | 'work' | 'text'
  workId: string
  work?: Work
  taskImplementationId?: string
  taskImplementation?: {
    answerId: string
    answer?: Answer
    commentId: string
    comment?: Comment
    assignedWorkId: string
    assignedWork?: AssignedWork
  }
  createdAt: Date
  updatedAt: Date
}
