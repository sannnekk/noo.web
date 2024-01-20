import type { DeltaContentType } from '../composed/DeltaContentType'
import type { Chapter } from './Chapter'
import type { Media } from './Media'
import type { Work } from './Work'

export interface Material {
  id: string
  slug: string
  name: string
  description: string
  content: DeltaContentType
  order: number
  chapterId: string
  chapter?: Chapter
  workId?: string
  work?: Work
  files: Media[]
  createdAt: Date
  updatedAt: Date
}
