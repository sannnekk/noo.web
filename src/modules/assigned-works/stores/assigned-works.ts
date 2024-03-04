import type { AssignedWork } from '@/core/data/entities/AssignedWork'
import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { Core } from '@/core/Core'
import { debounce } from '@/core/utils/debounce'
import { useSearch } from '@/composables/useSearch'
import type { Pagination } from '@/core/data/Pagination'

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
  'assigned-works-module:assigned-works',
  () => {
    const assignedWorkService = Core.Services.AssignedWork
    const uiService = Core.Services.UI

    /**
     * Load assigned works
     */
    async function fetchAssignedWorks(pagination?: Pagination) {
      try {
        return await assignedWorkService.getAssignedWorks(pagination || {})
      } catch (e: any) {
        uiService.openErrorModal('Ошибка при загрузке списка работ', e.message)
      }
    }

    /**
     * Search
     */
    const { pagination, results, resultsMeta, isListLoading } =
      useSearch<AssignedWork>(fetchAssignedWorks, {
        immediate: true
      })

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

        if (
          assignedWork.checkStatus === 'not-checked' &&
          (assignedWork.solveStatus === 'made-in-deadline' ||
            assignedWork.solveStatus === 'made-after-deadline')
        ) {
          return {
            action: 'Ожидает проверки',
            link: (id: string) => `/assigned-works/${id}/check`,
            icon: 'attention-yellow'
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

      if (
        assignedWork.checkStatus === 'not-checked' &&
        (assignedWork.solveStatus === 'made-in-deadline' ||
          assignedWork.solveStatus === 'made-after-deadline')
      ) {
        return {
          action: 'Ожидает проверки',
          link: (id: string) => `/assigned-works/${id}/read`,
          icon: 'attention-yellow'
        }
      }

      return {
        action: 'Просмотреть',
        link: (id: string) => `/assigned-works/${id}/read`,
        icon: 'check-green'
      }
    }

    return {
      pagination,
      isListLoading,
      results,
      resultsMeta,
      getUserAction
    }
  }
)
