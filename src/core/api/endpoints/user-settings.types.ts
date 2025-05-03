import type { MediaEntity } from './media.types'

export interface UserSettings {
  theme: 'light' | 'dark' | 'system'
  fontSize: 'small' | 'medium' | 'large'
  backgroundImage: MediaEntity | null
}
