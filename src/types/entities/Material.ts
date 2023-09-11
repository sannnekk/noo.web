import type { Subject } from './Subject'

export interface Material {
  id: string
  slug: string
  name: string
  description: string
  content: string
  subjectId: string
  subject?: Subject
  createdAt: Date
  updatedAt: Date
}
