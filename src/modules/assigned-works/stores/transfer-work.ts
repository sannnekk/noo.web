import { useSearch } from '@/composables/useSearch'
import { Core } from '@/core/Core'
import type { Pagination } from '@/core/data/Pagination'
import type { AssignedWork } from '@/core/data/entities/AssignedWork'
import type { User } from '@/core/data/entities/User'
import { debounce } from '@/core/utils/debounce'
import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'

export const useTransferWorkStore = defineStore(
  'assigned-works-module:transfer-work',
  () => {
    const assignedWorkService = Core.Services.AssignedWork
    const uiService = Core.Services.UI
    const userService = Core.Services.User

    const _route = useRoute()

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
      { immediate: true }
    )

    /**
     * current work to transfer
     */
    const work = ref<AssignedWork>()

    /**
     * Mentor id to transfer work to
     */
    const selectedMentorId = ref('')

    /**
     * Load assigned work
     */
    async function fetchAssignedWork() {
      uiService.setLoading(true)

      try {
        await assignedWorkService.getAssignedWork(
          _route.params.workId as string
        )
      } catch (e: any) {
        uiService.openErrorModal('Ошибка при загрузке работы', e.message)
      } finally {
        uiService.setLoading(false)
      }
    }

    /**
     * Submit transfer work request
     */
    function transfer() {
      if (!selectedMentorId.value) {
        uiService.openWarningModal('Выберите ментора')
        return
      }

      uiService.setLoading(true)

      try {
        assignedWorkService.transferAssignedWork(
          _route.params.workId as string,
          selectedMentorId.value
        )
        uiService.openSuccessModal('Работа успешно передана другому ментору')
      } catch (e: any) {
        uiService.openErrorModal('Ошибка при передаче работы', e.message)
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
      work,
      fetchAssignedWork
    }
  }
)
