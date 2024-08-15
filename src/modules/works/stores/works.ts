import { defineStore } from 'pinia'
import type { Work } from '@/core/data/entities/Work'
import { Core } from '@/core/Core'
import { useSearch } from '@/composables/useSearch'
import type { Pagination } from '@/core/data/Pagination'

export const useWorksStore = defineStore('works-module', () => {
  const uiService = Core.Services.UI
  const workService = Core.Services.Work

  /**
   * Search
   */
  const { pagination, results, resultsMeta, isListLoading, trigger } =
    useSearch(fetchWorks)

  /**
   * Fetch works list
   */
  async function fetchWorks(pagination: Pagination) {
    try {
      return await workService.getWorks(pagination)
    } catch (error: any) {
      uiService.openErrorModal(
        'Произошла ошибка при получении списка работ',
        error.message
      )
    }
  }

  /**
   * Copy work
   */
  async function copyWork(workSlug: Work['slug']) {
    try {
      await workService.copyWork(workSlug, { showLoader: true })

      pagination.value.page = 1

      // trigger reload
      trigger()
    } catch (error: any) {
      uiService.openErrorModal(
        'Произошла ошибка при копировании работы',
        error.message
      )
    }
  }

  /**
   * Delete work
   */
  async function deleteWork(workSlug: Work['slug']) {
    try {
      await workService.deleteWork(workSlug, { showLoader: true })

      // trigger reload
      trigger()
    } catch (error: any) {
      uiService.openErrorModal(
        'Произошла ошибка при удалении работы',
        error.message
      )
    }
  }

  return {
    triggerSearch: trigger,
    pagination,
    results,
    resultsMeta,
    isListLoading,
    fetchWorks,
    copyWork,
    deleteWork
  }
})
