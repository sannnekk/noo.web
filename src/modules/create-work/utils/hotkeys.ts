import { useCreateWorkStore } from '../stores/create-work'
import type { HotKeyDefinition } from '@/core/device/Hotkeys'

export const HOT_KEYS: HotKeyDefinition[] = [
  {
    keys: ['Ctrl', 'Enter'],
    description: 'Сохранить',
    shortcut: ['Ctrl', 'Enter'],
    handler: () => {
      const assignedWorkStore = useCreateWorkStore()
      assignedWorkStore.submitWork()
    }
  },
  {
    keys: ['Ctrl', 'n'],
    description: 'Добавить задание',
    shortcut: ['Ctrl', 'n'],
    handler: () => {
      const assignedWorkStore = useCreateWorkStore()
      assignedWorkStore.addTask()
    }
  },
  {
    keys: ['Ctrl', 'g'],
    description: 'Общая информация',
    shortcut: ['Ctrl', 'g'],
    handler: () => {
      const assignedWorkStore = useCreateWorkStore()
      assignedWorkStore.showGeneralInfo()
    }
  },
  {
    keys: ['Ctrl', 'ArrowLeft'],
    description: 'Предыдущее задание',
    shortcut: ['Ctrl', 'ArrowLeft'],
    handler: () => {
      const assignedWorkStore = useCreateWorkStore()
      assignedWorkStore.toPrevTask()
    }
  },
  {
    keys: ['Ctrl', 'ArrowRight'],
    description: 'Следующее задание',
    shortcut: ['Ctrl', 'ArrowRight'],
    handler: () => {
      const assignedWorkStore = useCreateWorkStore()
      assignedWorkStore.toNextTask()
    }
  }
]
