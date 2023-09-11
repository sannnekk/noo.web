import type { Material } from './Material'

export interface Work {
  id: string
  slug: string
  name: string
  description: string
  materialId: string
  material?: Material
  createdAt: Date
  updatedAt: Date
}
