import { useSearch } from '@/composables/useSearch'
import { Core } from '@/core/Core'
import type { Pagination } from '@/core/data/Pagination'
import type { AssignedWork } from '@/core/data/entities/AssignedWork'
import type { User } from '@/core/data/entities/User'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useTransferWorkStore = defineStore(
  'assigned-works-module:transfer-work',
  () => {
    const assignedWorkService = Core.Services.AssignedWork
    const uiService = Core.Services.UI
    const userService = Core.Services.User

    /**
     * Load mentors
     */
    async function fetchMentors(pagination?: Pagination) {
      try {
        return await userService.getMentors(pagination)
      } catch (error: any) {
        uiService.openErrorModal(
          'Ошибка при загрузке списка менторов',
          error.message
        )
      }
    }

    /**
     * search
     */
    const { results, resultsMeta, isListLoading, pagination } = useSearch<User>(
      fetchMentors,
      { immediate: false }
    )

    /**
     * Mentor id to transfer work to
     */
    const selectedMentorId = ref('')

    /**
     * Submit transfer work request
     */
    async function transfer(workId: AssignedWork['id']) {
      if (!selectedMentorId.value) {
        uiService.openWarningModal('Выберите куратора')
        return
      }

      try {
        await assignedWorkService.transferAssignedWork(
          workId,
          selectedMentorId.value,
          { showLoader: true }
        )
        uiService.openSuccessModal('Работа успешно передана другому куратору')
      } catch (e: any) {
        uiService.openErrorModal('Ошибка при передаче работы', e.message)
      }
    }

    /**
     * Transfer works to mentor
     */
    async function transferWorks(works: AssignedWork[]) {
      try {
        for (const work of works) {
          await assignedWorkService.transferAssignedWork(
            work.id,
            selectedMentorId.value,
            { showLoader: true }
          )
        }
        uiService.openSuccessModal('Работы успешно переданы другому ментору')
      } catch (error: any) {
        uiService.openErrorModal('Ошибка при передаче работ', error.message)
      }
    }

    return {
      pagination,
      results,
      resultsMeta,
      isListLoading,
      selectedMentorId,
      transfer,
      transferWorks
    }
  }
)
