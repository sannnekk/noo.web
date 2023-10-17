import type { Task } from './Task'
import type { Material } from './Material'

export interface Work {
  id: string
  slug: string
  name: string
  description: string
  materialId?: string
  material?: Material
  tasks: Task[]
  taskIds: string[]
  createdAt?: Date
  updatedAt?: Date
}
