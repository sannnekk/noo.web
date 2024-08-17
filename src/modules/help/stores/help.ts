import { Core } from '@/core/Core'
import type { FAQArticle } from '@/core/data/entities/FAQArticle'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useHelpStore = defineStore('help-module:help', () => {
  const uiService = Core.Services.UI
  const faqService = Core.Services.FAQ

  const articleTree = ref<FAQArticle[]>([])
  const categories = ref<FAQArticle['category'][]>([])

  async function fetchCategoryTree() {
    try {
      const response = await faqService.getCategoryTreeWithArticles()
      categories.value = response.data
    } catch (error: any) {
      uiService.openErrorModal('Не удалось загрузить категории', error.message)
    }
  }

  return {
    articleTree,
    categories,
    fetchCategoryTree
  }
})
