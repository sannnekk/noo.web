import type { PossiblyUnsavedEntity } from '@/core/utils/types.utils'
import type { AssignedWorkAnswerEntity } from './api/assigned-work.types'

export type AssignedWorkViewMode = 'read' | 'solve' | 'check'

export type PossiblyUnsavedAnswer =
  PossiblyUnsavedEntity<AssignedWorkAnswerEntity> & {
    isSaved: boolean
  }

export type TaskGrid = {
  hasAnswer: boolean
  checkStatus: 'none' | 'correct' | 'incorrect' | 'partially-correct'
}[]

export type AssignedWorkListTab = 'all' | 'not-made' | 'not-checked' | 'checked'
