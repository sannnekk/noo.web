import type { Material } from './Material'
import type { Subject } from './Subject'

export interface Chapter {
  id: string
  name: string
  slug: string
  subjectId: string
  subject?: Subject
  materials?: Material[]
  createdAt: Date
  updatedAt: Date
}
