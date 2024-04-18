import { useCreateCourseStore } from '../stores/create-course'
import type { HotKeyDefinition } from '@/core/device/Hotkeys'

export const HOT_KEYS: HotKeyDefinition[] = [
  {
    keys: ['Ctrl', 'Enter'],
    description: 'Сохранить',
    shortcut: ['Ctrl', 'Enter'],
    handler: () => {
      const assignedWorkStore = useCreateCourseStore()
      assignedWorkStore.publishCourse()
    }
  },
  {
    keys: ['Ctrl', 'n'],
    description: 'Добавить главу',
    shortcut: ['Ctrl', 'n'],
    handler: () => {
      const assignedWorkStore = useCreateCourseStore()
      assignedWorkStore.addChapter()
    }
  },
  {
    keys: ['Ctrl', 'g'],
    description: 'Добавить материал',
    shortcut: ['Ctrl', 'm'],
    handler: () => {
      const assignedWorkStore = useCreateCourseStore()
      assignedWorkStore.addMaterial()
    }
  }
]
