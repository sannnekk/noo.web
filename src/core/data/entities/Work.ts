import type { Task } from './Task'
import type { Entity } from '../Entity'
import type { Subject } from './Subject'

export interface Work extends Entity {
  slug: string
  type: 'trial-work' | 'mini-test' | 'test' | 'second-part' | 'phrase'
  name: string
  description: string
  subject: Subject
  subjectId: Subject['id']
  tasks: Task[]
  taskIds: string[]
  createdAt: Date
  updatedAt: Date
}
