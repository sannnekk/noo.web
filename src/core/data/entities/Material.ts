import type { DeltaContentType } from '../../../types/composed/DeltaContentType'
import type { Entity } from '../Entity'
import type { Chapter } from './Chapter'
import type { Media } from './Media'
import type { Work } from './Work'

export interface Material extends Entity {
  slug: string
  name: string
  description: string
  content: DeltaContentType
  order: number
  chapterId: string
  chapter?: Chapter
  workId?: string
  isActive: boolean
  work?: Work
  files: Media[]
  createdAt: Date
  updatedAt: Date
  workSolveDeadline?: Date
  workCheckDeadline?: Date
}
