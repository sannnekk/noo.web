import { defineStore } from 'pinia'
import { ref, reactive, watch } from 'vue'
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
  const { pagination, results, resultsMeta, isListLoading } =
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
    uiService.setLoading(true)
    try {
      await workService.copyWork(workSlug)

      pagination.value.page = 1

      // trigger reload
      pagination.value.search = '$$$'
      pagination.value.search = ''
    } catch (error: any) {
      uiService.openErrorModal(
        'Произошла ошибка при копировании работы',
        error.message
      )
    } finally {
      uiService.setLoading(false)
    }
  }

  return {
    pagination,
    results,
    resultsMeta,
    isListLoading,
    fetchWorks,
    copyWork
  }
})
