import type { AssignedWork } from '@/core/data/entities/AssignedWork'
import { defineStore } from 'pinia'
import { ref, reactive, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import type { Task } from '@/core/data/entities/Task'
import { isDeltaEmptyOrWhitespace } from '@/core/utils/deltaHelpers'
import { Core } from '@/core/Core'

export type ActionType = 'read' | 'solve' | 'check'

export type UserAction = {
  action: string
  link: (id: string) => `/assigned-works/${typeof id}/${ActionType}`
  icon: string
}

export type Visibility = 'visible' | 'readonly' | 'hidden'

export type FieldVisibility = {
  solveBox: Visibility
  checkBox: Visibility
  scoreBox: Visibility
}

export const useAssignedWorksStore = defineStore(
  'assigned-works:assigned-works',
  () => {
    const assignedWorkService = Core.Services.AssignedWork
    const uiService = Core.Services.UI
    const _route = useRoute()

    /**
     * List of assigned works
     */
    const works = ref<AssignedWork[]>([])

    /**
     * Search query
     */
    const search = ref('')

    /**
     * Loading state of the list
     */
    const listLoading = ref(false)

    /**
     * Watch for route change to load assigned works
     */
    watch(
      [() => _route.path, search],
      async () => {
        if (_route.path === '/assigned-works') {
          listLoading.value = true

          try {
            const response = await assignedWorkService.getAssignedWorks({
              search: search.value
            })
            works.value = response.data
          } catch (e: any) {
            uiService.openErrorModal(
              'Ошибка при загрузке списка работ',
              e.message
            )
          } finally {
            listLoading.value = false
          }
        }
      },
      { immediate: true }
    )

    /**
     * Get user action for assigned work based on its role
     */
    function getUserAction(assignedWork: AssignedWork): UserAction {
      const role = Core.Context.User!.role

      if (role === 'admin' || role === 'teacher') {
        return {
          action: 'Просмотреть',
          link: (id: string) => `/assigned-works/${id}/read`,
          icon: ''
        }
      }

      if (role === 'mentor') {
        if (
          assignedWork.solveStatus === 'not-started' ||
          assignedWork.solveStatus === 'in-progress'
        ) {
          return {
            action: 'Просмотреть',
            link: (id: string) => `/assigned-works/${id}/read`,
            icon: 'cross-red'
          }
        }

        if (assignedWork.checkStatus === 'not-checked') {
          return {
            action: 'Проверить',
            link: (id: string) => `/assigned-works/${id}/check`,
            icon: 'attention-yellow'
          }
        }

        if (assignedWork.checkStatus === 'in-progress') {
          return {
            action: 'Продолжить проверку',
            link: (id: string) => `/assigned-works/${id}/check`,
            icon: 'attention-yellow'
          }
        }

        return {
          action: 'Просмотреть',
          link: (id: string) => `/assigned-works/${id}/read`,
          icon: 'check-green'
        }
      }

      // role is student
      if (assignedWork.solveStatus === 'not-started') {
        return {
          action: 'Начать выполнение',
          link: (id: string) => `/assigned-works/${id}/solve`,
          icon: 'cross-red'
        }
      }

      if (assignedWork.solveStatus === 'in-progress') {
        return {
          action: 'Продолжить выполнение',
          link: (id: string) => `/assigned-works/${id}/solve`,
          icon: 'cross-red'
        }
      }

      return {
        action: 'Просмотреть',
        link: (id: string) => `/assigned-works/${id}/read`,
        icon: 'check-green'
      }
    }

    return {
      works,
      search,
      getUserAction,
      listLoading
    }
  }
)
