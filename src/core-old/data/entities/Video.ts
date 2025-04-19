import type { DeltaContentType } from '@/types/richtext/DeltaContentType'
import type { Entity } from '../Entity'
import type { Media } from './Media'
import type { User } from './User'
import type { VideoChapter } from './VideoChapter'
import type { VideoComment } from './VideoComment'

export interface Video extends Entity {
  title: string
  description: DeltaContentType
  thumbnail: Media
  url: string | null
  sizeInBytes: number
  serviceType: 'yandex'
  state: 'not-uploaded' | 'uploaded' | 'uploading' | 'failed'
  uniqueIdentifier: string
  duration: number
  chapters: VideoChapter[]
  comments: VideoComment[]
  uploadedBy: User
  uploadUrl: string | null
  publishedAt: Date
  accessType: 'everyone' | 'courseId' | 'mentorId' | 'role'
  accessValue: string | null
  reactionCounts?: Record<string, number>
  myReaction?: string | null
}
