import { defineStore } from 'pinia'
import { ref, reactive, watch } from 'vue'
import type { Work } from '@/core/data/entities/Work'
import { Core } from '@/core/Core'

export const useWorksStore = defineStore('works-module', () => {
  const uiService = Core.Services.UI
  const workService = Core.Services.Work

  /**
   * Works list
   */
  const works = ref<Work[]>([])

  /**
   * Search query for works
   */
  const search = ref('')

  /**
   * Loading state for works list
   */
  const listLoading = ref(false)

  /**
   * Load works list
   */
  watch(
    search,
    async () => {
      listLoading.value = true

      try {
        const response = await workService.getWorks({ search: search.value })
      } catch (error: any) {
        uiService.openErrorModal(
          'Произошла ошибка при получении списка работ',
          error.message
        )
      } finally {
        listLoading.value = false
      }
    },
    { immediate: true }
  )

  return {
    works,
    search,
    listLoading
  }
})
