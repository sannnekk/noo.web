import { Core } from '@/core/Core'
import type { AssignedWork } from '@/core/data/entities/AssignedWork'
import type { User } from '@/core/data/entities/User'
import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'

export const useTransferWorkStore = defineStore('transfer-work', () => {
  const assignedWorkService = Core.Services.AssignedWork
  const uiService = Core.Services.UI
  const userService = Core.Services.User

  const _route = useRoute()

  /**
   * student search query
   */
  const search = ref('')

  /**
   * mentors list
   */
  const mentors = ref<User[]>([])

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
  watch(
    () => _route.params.workId,
    async () => {
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
    },
    { immediate: true }
  )

  /**
   * Watch for search query to load mentors
   */
  watch(
    search,
    async () => {
      try {
        const response = await userService.getMentors({ search: search.value })
        mentors.value = response.data
      } catch (e: any) {
        uiService.openErrorModal(
          'Ошибка при загрузке списка менторов',
          e.message
        )
      }
    },
    { immediate: true }
  )

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

  return { search, mentors, selectedMentorId, transfer, work }
})
