import { useCreateBlogpostStore } from '../stores/create-blogpost'
import type { HotKeyDefinition } from '@/core/device/Hotkeys'

export const HOT_KEYS: HotKeyDefinition[] = [
  {
    keys: ['Ctrl', 'Enter'],
    description: 'Сохранить',
    shortcut: ['Ctrl', 'Enter'],
    handler: () => {
      const assignedWorkStore = useCreateBlogpostStore()
      assignedWorkStore.saveBlogpost()
    }
  }
]
