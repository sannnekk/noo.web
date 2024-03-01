import type { Task } from './Task'
import type { Material } from './Material'
import type { Entity } from '../Entity'

export interface Work extends Entity {
  slug: string
  type: 'type1' | 'type2' | 'type3'
  name: string
  description: string
  materialId?: string
  material?: Material
  tasks: Task[]
  taskIds: string[]
  createdAt: Date
  updatedAt: Date
}
