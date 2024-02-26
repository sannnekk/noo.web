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

  return {
    pagination,
    results,
    resultsMeta,
    isListLoading
  }
})
