import type { DeltaContentType } from '@/types/richtext/DeltaContentType'
import type { User } from './User'
import type { Entity } from '../Entity'
import type { Poll } from './Poll'
import type { Media } from './Media'

export type Reaction = 'like' | 'dislike' | 'sad' | 'happy' | 'mindblowing'

export interface BlogPost extends Entity {
  title: string
  content: DeltaContentType
  author: User
  authorId?: User['id']
  tags: string[]
  reactionCounts: Record<Reaction, number>
  myReaction?: Reaction
  poll?: Poll
  pollId?: Poll['id']
  files: Media[]
  createdAt: Date
  updatedAt: Date
}
