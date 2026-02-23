import { useAssignedWorkStore } from '../stores/assigned-work'
import type { HotKeyDefinition } from '@/core/device/Hotkeys'

export const HOT_KEYS: HotKeyDefinition[] = [
  {
    keys: ['Ctrl', 'Enter'],
    description: 'Отправить решение/проверку',
    shortcut: ['Ctrl', 'Enter'],
    handler: () => {
      const assignedWorkStore = useAssignedWorkStore()
      assignedWorkStore.sureSubmitModalVisible = true
    }
  },
  {
    keys: ['Ctrl', 'ArrowLeft'],
    description: 'Предыдущее задание',
    shortcut: ['Ctrl', 'ArrowLeft'],
    handler: () => {
      const assignedWorkStore = useAssignedWorkStore()
      const router = assignedWorkStore._router

      if (!assignedWorkStore.previousTaskLink) return

      router.push(assignedWorkStore.previousTaskLink)
    }
  },
  {
    keys: ['Ctrl', 'ArrowRight'],
    description: 'Следующее задание',
    shortcut: ['Ctrl', 'ArrowRight'],
    handler: () => {
      const assignedWorkStore = useAssignedWorkStore()
      const router = assignedWorkStore._router

      if (!assignedWorkStore.nextTaskLink) return

      router.push(assignedWorkStore.nextTaskLink)
    }
  }
]
