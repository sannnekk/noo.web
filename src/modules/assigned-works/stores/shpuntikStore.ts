import { defineStore } from 'pinia'
import { computed, reactive } from 'vue'
import { Core } from '@/core/Core'
import { useAssignedWorkStore } from './assigned-work'

export const useShpuntikStore = defineStore(
  'assigned-works-module:shpuntik',
  () => {
    const shpuntikService = Core.Services.Shpuntik
    const uiService = Core.Services.UI
    const assignedWorkStore = useAssignedWorkStore()

    const modal = reactive({
      visible: false,
      taskId: null as string | null
    })

    const workId = computed(() => assignedWorkStore.assignedWorkId)

    function openModal(taskId: string): void {
      modal.taskId = taskId
      modal.visible = true
    }

    async function check(): Promise<void> {
      if (modal.taskId === null) {
        return
      }

      try {
        await shpuntikService.checkTask(workId.value, modal.taskId, {
          showLoader: true
        })

        await reloadWork()
      } catch (error: any) {
        uiService.openErrorModal(
          'Шпунтик не справился с проверкой',
          error.message
        )
      }
    }

    async function removeComment(taskId: string): Promise<void> {
      try {
        await shpuntikService.removeComment(workId.value, taskId, {
          showLoader: true
        })

        await reloadWork()
      } catch (error: any) {
        uiService.openErrorModal(
          'Не удалось удалить комментарий',
          error.message
        )
      }
    }

    async function reloadWork(): Promise<void> {
      // reset the work so that the task components are remounted with the new comment
      assignedWorkStore.assignedWork = null
      await assignedWorkStore.fetchAssignedWork()
    }

    return { modal, openModal, check, removeComment }
  }
)
