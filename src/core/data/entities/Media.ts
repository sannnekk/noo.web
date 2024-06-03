import type { Entity } from '../Entity'

export interface Media extends Entity {
  src: string
  name: string
  mimeType: 'image/jpeg' | 'image/png' | 'application/pdf'
  createdAt: Date
}
