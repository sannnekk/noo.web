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
    keys: ['Ctrl', 'l'],
    description: 'Добавить главу',
    shortcut: ['Ctrl', 'l'],
    handler: () => {
      const assignedWorkStore = useCreateCourseStore()
      assignedWorkStore.newChapterName = 'Новая глава'
      assignedWorkStore.addChapter()
    }
  },
  {
    keys: ['Ctrl', 'u'],
    description: 'Добавить материал',
    shortcut: ['Ctrl', 'u'],
    handler: () => {
      const assignedWorkStore = useCreateCourseStore()
      assignedWorkStore.addMaterial()
    }
  }
]
