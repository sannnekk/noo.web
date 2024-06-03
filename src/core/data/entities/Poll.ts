import type { Entity } from '../Entity'
import type { PollQuestion } from './PollQuestion'
import type { User } from './User'

export type PollVisibility = User['role'] | 'everyone'

export interface Poll extends Entity {
  title: string
  description: string
  canVote: PollVisibility[]
  canSeeResults: PollVisibility[]
  requireAuth: boolean
  stopAt: Date
  isStopped: boolean
  createdAt: Date
  updatedAt: Date
  questions: PollQuestion[]
  votedUserIds: User['id'][]
}
