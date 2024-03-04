import type { DeltaContentType } from '../../../types/composed/DeltaContentType'
import type { Entity } from '../Entity'
import type { TaskOption } from './TaskOption'
import type { Work } from './Work'

export interface Task extends Entity {
  slug: string
  order: number
  content: DeltaContentType
  highestScore: number
  type: 'one_choice' | 'multiple_choice' | 'word' | 'text'
  workId: Work['id']
  work?: Work
  rightAnswer?: string
  solveHint?: DeltaContentType
  checkHint?: DeltaContentType
  checkingStrategy?: 'type1' | 'type2'
  options?: TaskOption[]
  optionsIds?: TaskOption['id'][]
  createdAt: Date
  updatedAt: Date
}
