import type { DeltaContentType } from '../../../types/composed/DeltaContentType'
import type { Entity } from '../Entity'
import type { Chapter } from './Chapter'
import type { Media } from './Media'
import type { Poll } from './Poll'
import type { Video } from './Video'
import type { Work } from './Work'

export interface Material extends Entity {
  slug: string
  name: string
  description: string
  content: DeltaContentType
  order: number
  chapterId?: string
  chapter?: Chapter
  workId?: string
  isActive: boolean
  activateAt: Date | null
  work?: Work
  isWorkAvailable: boolean
  isPinned: boolean
  titleColor: string
  files: Media[]
  createdAt: Date
  updatedAt: Date
  workSolveDeadline: Date | null
  workCheckDeadline: Date | null
  poll?: Poll
  pollId?: Poll['id']
  videos: Video[]
  reactionCounts?: Record<string, number>
  myReaction?: string
}
