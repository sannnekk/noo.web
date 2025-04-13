import type { IconName } from '@/components/icons/noo-icon.vue'
import type { useSearch } from '@/composables/useSearch'

export interface SupportedEntity {
  icon: IconName
  name: string
  technicalName: string
  availableSelectorProps: {
    label: string
    value: string
    labelKeys: string[]
    fetchFunction: Parameters<typeof useSearch>[0]
    toPropValue: (item: any) => any
  }[]
}
