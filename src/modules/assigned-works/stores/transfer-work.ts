import { useSearch } from '@/composables/useSearch'
import { Core } from '@/core/Core'
import type { Pagination } from '@/core/data/Pagination'
import type { AssignedWork } from '@/core/data/entities/AssignedWork'
import type { User } from '@/core/data/entities/User'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useAssignedWorksStore } from './assigned-works'

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
        uiService.openWarningModal('Выберите ментора')
        return
      }

      uiService.setLoading(true)

      try {
        await assignedWorkService.transferAssignedWork(
          workId,
          selectedMentorId.value
        )
        uiService.openSuccessModal('Работа успешно передана другому ментору')
      } catch (e: any) {
        uiService.openErrorModal('Ошибка при передаче работы', e.message)
      } finally {
        uiService.setLoading(false)
      }
    }

    /**
     * Transfer works to mentor
     */
    async function transferWorks(works: AssignedWork[]) {
      uiService.setLoading(true)

      try {
        await Promise.all(
          works.map((work) =>
            assignedWorkService.transferAssignedWork(
              work.id,
              selectedMentorId.value
            )
          )
        )
        uiService.openSuccessModal('Работы успешно переданы другому ментору')
      } catch (error: any) {
        uiService.openErrorModal('Ошибка при передаче работ', error.message)
      } finally {
        uiService.setLoading(false)
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
