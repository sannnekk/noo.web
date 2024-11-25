import type { DeltaContentType } from '@/types/composed/DeltaContentType'
import type { Entity } from '../Entity'
import type { Media } from './Media'
import type { User } from './User'
import type { VideoChapter } from './VideoChapter'

export interface Video extends Entity {
  title: string
  description: DeltaContentType
  thumbnail: Media
  url: string | null
  sizeInBytes: number
  serviceType: 'yandex'
  state: 'not-uploaded' | 'uploaded' | 'uploading' | 'failed'
  uniqueIdentifier: string
  length: number
  chapters: VideoChapter[]
  uploadedBy: User
  uploadUrl: string | null
  publishedAt: Date
}
