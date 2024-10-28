import type { Entity } from '../Entity'
import type { Media } from './Media'

export interface UserSettings extends Entity {
  backgroundImage: Media | null
  fontSize: 'small' | 'medium' | 'large'
}
