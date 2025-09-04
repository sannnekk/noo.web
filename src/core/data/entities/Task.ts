import type { DeltaContentType } from '../../../types/composed/DeltaContentType'
import type { Entity } from '../Entity'
import type { Work } from './Work'

export interface Task extends Entity {
  slug: string
  order: number
  content: DeltaContentType
  highestScore: number
  type: 'word' | 'text' | 'essay' | 'final-essay' | 'dictation'
  workId?: Work['id']
  work?: Work
  rightAnswer: string | null
  solveHint?: DeltaContentType
  checkHint?: DeltaContentType
  checkingStrategy: 'type1' | 'type2' | 'type3' | 'type4' | null
  isAnswerVisibleBeforeCheck: boolean
  isCheckOneByOneEnabled: boolean
  createdAt: Date
  updatedAt: Date
}
