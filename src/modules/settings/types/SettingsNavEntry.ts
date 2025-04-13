import type { IconName } from '@/components/icons/noo-icon.vue'
import type { User } from '@/core/data/entities/User'

export type SettingsNavEntry = {
  title: string
  description?: string
  icon: IconName
  route: string
  for: User['role'][]
}
