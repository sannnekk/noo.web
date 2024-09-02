import type { DeltaContentType } from '../../../types/composed/DeltaContentType'
import type { Entity } from '../Entity'
import type { Work } from './Work'

export interface Task extends Entity {
  slug: string
  order: number
  content: DeltaContentType
  highestScore: number
  type: 'word' | 'text'
  workId?: Work['id']
  work?: Work
  rightAnswer?: string
  solveHint?: DeltaContentType
  checkHint?: DeltaContentType
  checkingStrategy?: 'type1' | 'type2' | 'type3' | 'type4'
  isAnswerVisibleBeforeCheck: boolean
  createdAt: Date
  updatedAt: Date
}
