import type { Chapter } from './Chapter'

export interface Subject {
  id: string
  slug: string
  name: string
  description: string
  chapters?: Chapter[]
  createdAt: Date
  updatedAt: Date
}
