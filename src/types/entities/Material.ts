import type { Chapter } from './Chapter'
import type { Work } from './Work'

export interface Material {
  id: string
  slug: string
  name: string
  description: string
  content: string
  chapterId: string
  chapter?: Chapter
  workId?: string
  work?: Work
  createdAt: Date
  updatedAt: Date
}
