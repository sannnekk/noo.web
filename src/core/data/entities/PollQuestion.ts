import type { Entity } from '../Entity'
import type { Media } from './Media'
import type { PollAnswer } from './PollAnswer'

export type QuestionType =
  | 'text'
  | 'number'
  | 'date'
  | 'file'
  | 'choice'
  | 'rating'

export interface PollQuestion extends Entity {
  text: string
  description?: string
  type: QuestionType
  required: boolean
  answers: PollAnswer[]

  // choice
  choices?: string[]
  minChoices?: number
  maxChoices?: number

  // rating
  minRating?: number
  maxRating?: number
  onlyIntegerRating?: boolean

  // file
  maxFileSize?: number
  maxFileCount?: number
  allowedFileTypes?: Media['mimeType'][]

  // text
  minLength?: number
  maxLength?: number

  // number
  minValue?: number
  maxValue?: number
  onlyIntegerValue?: boolean

  // date
  onlyFutureDate?: boolean
  onlyPastDate?: boolean
}
