import type { AssignedWork } from '@/core/data/entities/AssignedWork'
import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import { Core } from '@/core/Core'
import { useSearch } from '@/composables/useSearch'
import type { Pagination } from '@/core/data/Pagination'

export const useAssignedWorksStore = defineStore(
  'assigned-works-module:assigned-works',
  () => {
    const assignedWorkService = Core.Services.AssignedWork
    const uiService = Core.Services.UI

    /**
     * Current tab index
     */
    const currentTabIndex = ref(0)

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
      useFetchAssignedWorks(
        Core.Context.User!.role === 'mentor'
          ? {
              'filter[isArchivedByMentors]': { type: 'boolean', value: false },
              'filter[solveStatus]': {
                type: 'arr',
                value: ['made-in-deadline', 'made-after-deadline']
              }
            }
          : {
              'filter[isArchivedByStudent]': { type: 'boolean', value: false }
            }
      ),
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
      useFetchAssignedWorks(
        Core.Context.User!.role === 'mentor'
          ? {
              'filter[solveStatus]': {
                type: 'arr',
                value: ['not-started', 'in-progress']
              },
              'filter[isArchivedByMentors]': {
                type: 'boolean',
                value: false
              }
            }
          : {
              'filter[solveStatus]': {
                type: 'arr',
                value: ['not-started', 'in-progress']
              },
              'filter[isArchivedByStudent]': {
                type: 'boolean',
                value: false
              }
            }
      ),
      { immediate: false }
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
      useFetchAssignedWorks(
        Core.Context.User!.role === 'mentor'
          ? {
              'filter[checkStatus]': {
                type: 'arr',
                value: ['not-checked', 'in-progress']
              },
              'filter[solveStatus]': {
                type: 'arr',
                value: ['made-in-deadline', 'made-after-deadline']
              },
              'filter[isArchivedByMentors]': {
                type: 'boolean',
                value: false
              }
            }
          : {
              'filter[checkStatus]': {
                type: 'arr',
                value: ['not-checked', 'in-progress']
              },
              'filter[isArchivedByStudent]': {
                type: 'boolean',
                value: false
              }
            }
      ),
      { immediate: false }
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
      useFetchAssignedWorks(
        Core.Context.User!.role === 'mentor'
          ? {
              'filter[checkStatus]': {
                type: 'arr',
                value: [
                  'checked-in-deadline',
                  'checked-after-deadline',
                  'checked-automatically'
                ]
              },
              'filter[isArchivedByMentors]': {
                type: 'boolean',
                value: false
              }
            }
          : {
              'filter[checkStatus]': {
                type: 'arr',
                value: [
                  'checked-in-deadline',
                  'checked-after-deadline',
                  'checked-automatically'
                ]
              },
              'filter[isArchivedByStudent]': {
                type: 'boolean',
                value: false
              }
            }
      ),
      { immediate: false }
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
      useFetchAssignedWorks(
        Core.Context.User!.role === 'mentor'
          ? {
              'filter[isArchivedByMentors]': {
                type: 'boolean',
                value: true
              }
            }
          : {
              'filter[isArchivedByStudent]': {
                type: 'boolean',
                value: true
              }
            }
      ),
      { immediate: false }
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
     * Archive works
     */
    async function archiveWorks(works: AssignedWork[]) {
      uiService.setLoading(true)
      try {
        for (const work of works) {
          await assignedWorkService.archiveAssignedWork(work.id, {
            showLoader: true
          })
        }
        uiService.openSuccessModal('Работы успешно архивированы!')
        allSearch.trigger()
        archivedSearch.trigger()
      } catch (e: any) {
        uiService.openErrorModal('Ошибка при архивировании работ', e.message)
      } finally {
        uiService.setLoading(false)
      }
    }

    /**
     * Unrchive works
     */
    async function unarchiveWorks(works: AssignedWork[]) {
      try {
        for (const work of works) {
          await assignedWorkService.unarchiveAssignedWork(work.id, {
            showLoader: true
          })
        }
        uiService.openSuccessModal('Работы успешно архивированы!')
        allSearch.trigger()
        archivedSearch.trigger()
      } catch (e: any) {
        uiService.openErrorModal('Ошибка при архивировании работ', e.message)
      }
    }

    /**
     * Send works to revision
     */
    async function sendWorksToRevision(works: AssignedWork[]) {
      try {
        for (const work of works) {
          await assignedWorkService.sendToRevision(work.id, {
            showLoader: true
          })
        }
        uiService.openSuccessModal('Работы успешно отправлены на доработку!')
        allSearch.trigger()
      } catch (e: any) {
        uiService.openErrorModal(
          'Ошибка при отправке работ на доработку',
          e.message
        )
      }
    }

    /**
     * Delete works
     */
    async function deleteWorks(works: AssignedWork[]) {
      uiService.setLoading(true)

      try {
        for (const work of works) {
          await assignedWorkService.deleteAssignedWork(work.id, {
            showLoader: true
          })
        }
        uiService.openSuccessModal('Работы успешно удалены!')
        allSearch.trigger()
      } catch (e: any) {
        uiService.openErrorModal('Ошибка при удалении работ', e.message)
      } finally {
        uiService.setLoading(false)
      }
    }

    /**
     * On tab change
     */
    function changeTab() {
      switch (currentTabIndex.value) {
        case 0:
          allSearch.triggerOnce()
          break
        case 1:
          notSolvedSearch.triggerOnce()
          break
        case 2:
          notCheckedSearch.triggerOnce()
          break
        case 3:
          checkedSearch.triggerOnce()
          break
        case 4:
          archivedSearch.triggerOnce()
          break
      }
    }

    watch(currentTabIndex, changeTab)

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
      archiveWorks,
      unarchiveWorks,
      sendWorksToRevision,
      currentTabIndex,
      deleteWorks
    }
  }
)
