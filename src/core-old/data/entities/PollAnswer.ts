import type { Entity } from '../Entity'
import type { Media } from './Media'

export interface PollAnswer extends Entity {
  questionId: string
  questionType: string
  // answer types
  text?: string
  number?: number
  date?: Date
  files?: Media[]
  choices?: string[]
  rating?: number
  createdAt?: Date
  updatedAt?: Date
}
