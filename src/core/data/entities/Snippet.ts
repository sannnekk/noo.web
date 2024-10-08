import type { DeltaContentType } from '@/types/composed/DeltaContentType'
import type { User } from './User'
import type { Entity } from '../Entity'

export interface Snippet extends Entity {
  name: string
  content: DeltaContentType
  userId: User['id']
}
