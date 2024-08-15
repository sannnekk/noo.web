import type { IconName } from '@/components/decorations/inline-icon.vue'
import type { User } from '@/core/data/entities/User'

export type SettingsNavEntry = {
  title: string
  description?: string
  icon: IconName
  route: string
  for: User['role'][]
}
