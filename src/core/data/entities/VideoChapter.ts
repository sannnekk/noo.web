import type { Entity } from '../Entity'

export interface VideoChapter extends Entity {
  title: string
  description: string | null
  timestamp: number
}
