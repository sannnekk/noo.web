import type { DeltaContentType } from '../composed/DeltaContentType'
import type { Answer } from './Answer'
import type { AssignedWork } from './AssignedWork'
import type { Comment } from './Comment'
import type { TaskOption } from './TaskOption'
import type { Work } from './Work'

export interface Task {
  id: string
  slug: string
  content: DeltaContentType
  highestScore: number
  type: 'one_choice' | 'multiple_choice' | 'word' | 'text'
  workId: Work['id']
  work?: Work
  rightAnswer?: string
  options?: TaskOption[]
  optionsIds?: TaskOption['id'][]
  createdAt: Date
  updatedAt: Date
}
