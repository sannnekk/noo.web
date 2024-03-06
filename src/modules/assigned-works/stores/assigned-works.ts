import type { AssignedWork } from '@/core/data/entities/AssignedWork'
import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
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
    function useFetchAssignedWorks(filters?: Pagination) {
      return async function (pagination?: Pagination) {
        try {
          return await assignedWorkService.getAssignedWorks({
            ...(pagination || {}),
            ...(filters || {})
          })
        } catch (e: any) {
          uiService.openErrorModal(
            'Ошибка при загрузке списка работ',
            e.message
          )
        }
      }
    }

    /**
     * Search for all works
     */
    const allSearch = useSearch<AssignedWork>(
      useFetchAssignedWorks({
        'filter[isArchived]': {
          type: 'boolean',
          value: false
        }
      }),
      {
        immediate: true
      }
    )

    /**
     * Checked works for allSearch
     */
    const allSearchChecklist = ref<AssignedWork['id'][]>([])
    const allSearchSelectedWorks = computed(
      () =>
        allSearchChecklist.value
          .map((id) => allSearch.results.value.find((aw) => aw.id === id))
          .filter(Boolean) as AssignedWork[]
    )

    /**
     * Search for not solved works
     */
    const notSolvedSearch = useSearch<AssignedWork>(
      useFetchAssignedWorks({
        'filter[solveStatus]': {
          type: 'arr',
          value: ['not-started', 'in-progress']
        },
        'filter[isArchived]': {
          type: 'boolean',
          value: false
        }
      })
    )

    /**
     * Checked works for notSolvedSearch
     */
    const notSolvedSearchChecklist = ref<AssignedWork['id'][]>([])
    const notSolvedSearchSelectedWorks = computed(
      () =>
        notSolvedSearchChecklist.value
          .map((id) => notSolvedSearch.results.value.find((aw) => aw.id === id))
          .filter(Boolean) as AssignedWork[]
    )

    /**
     * Search for not checked works
     */
    const notCheckedSearch = useSearch<AssignedWork>(
      useFetchAssignedWorks({
        'filter[checkStatus]': {
          type: 'arr',
          value: ['not-checked', 'in-progress']
        },
        'filter[isArchived]': {
          type: 'boolean',
          value: false
        }
      })
    )

    /**
     * Checked works for notCheckedSearch
     */
    const notCheckedSearchChecklist = ref<AssignedWork['id'][]>([])
    const notCheckedSearchSelectedWorks = computed(
      () =>
        notCheckedSearchChecklist.value
          .map((id) =>
            notCheckedSearch.results.value.find((aw) => aw.id === id)
          )
          .filter(Boolean) as AssignedWork[]
    )

    /**
     * Search for checked works
     */
    const checkedSearch = useSearch<AssignedWork>(
      useFetchAssignedWorks({
        'filter[checkStatus]': {
          type: 'arr',
          value: ['checked-in-deadline', 'checked-after-deadline']
        },
        'filter[isArchived]': {
          type: 'boolean',
          value: false
        }
      })
    )

    /**
     * Checked works for checkedSearch
     */
    const checkedSearchChecklist = ref<AssignedWork['id'][]>([])
    const checkedSearchSelectedWorks = computed(
      () =>
        checkedSearchChecklist.value
          .map((id) => checkedSearch.results.value.find((aw) => aw.id === id))
          .filter(Boolean) as AssignedWork[]
    )

    /**
     * Search for archived works
     */
    const archivedSearch = useSearch<AssignedWork>(
      useFetchAssignedWorks({
        'filter[isArchived]': {
          type: 'boolean',
          value: true
        }
      })
    )

    /**
     * Checked works for archivedSearch
     */
    const archivedSearchChecklist = ref<AssignedWork['id'][]>([])
    const archivedSearchSelectedWorks = computed(
      () =>
        archivedSearchChecklist.value
          .map((id) => archivedSearch.results.value.find((aw) => aw.id === id))
          .filter(Boolean) as AssignedWork[]
    )

    /**
     * Get user action for assigned work based on its role
     */
    function getUserAction(assignedWork: AssignedWork): UserAction {
      const role = Core.Context.User!.role

      if (role === 'admin' || role === 'teacher' || assignedWork.isArchived) {
        return {
          action: 'Просмотреть',
          link: (id: string) => `/assigned-works/${id}/read`,
          icon: 'delete'
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

    /**
     * Archive works
     */
    async function archiveWorks(works: AssignedWork[]) {
      uiService.setLoading(true)
      try {
        await Promise.all(
          works.map((work) => assignedWorkService.archiveAssignedWork(work.id))
        )
        uiService.openSuccessModal('Работы успешно архивированы!')
      } catch (e: any) {
        uiService.openErrorModal('Ошибка при архивировании работ', e.message)
      } finally {
        uiService.setLoading(false)
      }
    }

    return {
      allSearch,
      allSearchChecklist,
      allSearchSelectedWorks,
      notSolvedSearch,
      notSolvedSearchChecklist,
      notSolvedSearchSelectedWorks,
      notCheckedSearch,
      notCheckedSearchChecklist,
      notCheckedSearchSelectedWorks,
      archivedSearch,
      archivedSearchChecklist,
      archivedSearchSelectedWorks,
      checkedSearch,
      checkedSearchChecklist,
      checkedSearchSelectedWorks,
      getUserAction,
      archiveWorks
    }
  }
)
