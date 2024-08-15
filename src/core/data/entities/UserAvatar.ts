import type { Entity } from '../Entity'
import type { Media } from './Media'

export interface UserAvatar extends Entity {
  media: Media | null
  avatarType: 'telegram' | 'custom'
  telegramAvatarUrl: string | null
}
