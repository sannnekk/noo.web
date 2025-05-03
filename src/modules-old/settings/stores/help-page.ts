import { useSearch } from '@/composables/useSearch'
import { Core } from '@/core/Core'
import type { Pagination } from '@/core/data/Pagination'
import type { FAQArticle } from '@/core/data/entities/FAQArticle'
import type { FAQCategory } from '@/core/data/entities/FAQCategory'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useHelpPageStore = defineStore('settings-module:help-page', () => {
  const faqService = Core.Services.FAQ
  const uiService = Core.Services.UI

  const categoryTree = ref<FAQCategory[]>([])

  const articleSearch = useSearch(fetchArticles)

  async function fetchArticles(pagination?: Pagination) {
    try {
      return faqService.getArticles(pagination)
    } catch (error: any) {
      uiService.openErrorModal('Не удалось загрузить статьи', error.message)
    }
  }

  async function fetchArticle(id: FAQArticle['id']) {
    try {
      return faqService.getArticle(id, { showLoader: true })
    } catch (error: any) {
      uiService.openErrorModal('Не удалось загрузить статью', error.message)
    }
  }

  async function createArticle(article: FAQArticle) {
    try {
      await faqService.createArticle(article, { showLoader: true })
      articleSearch.trigger()
    } catch (error: any) {
      uiService.openErrorModal('Не удалось создать статью', error.message)
    }
  }

  async function createCategory(category: FAQCategory) {
    try {
      await faqService.createCategory(category, { showLoader: true })
      fetchCategoryTree()
    } catch (error: any) {
      uiService.openErrorModal('Не удалось создать категорию', error.message)
    }
  }

  async function updateCategory(category: FAQCategory) {
    try {
      await faqService.updateCategory(category.id, category, {
        showLoader: true
      })
      await fetchCategoryTree()
    } catch (error: any) {
      uiService.openErrorModal('Не удалось обновить категорию', error.message)
    }
  }

  async function fetchCategoryTree() {
    try {
      const response = await faqService.getCategoryTree({ showLoader: true })
      categoryTree.value = response.data
    } catch (error: any) {
      uiService.openErrorModal(
        'Не удалось загрузить список категорий',
        error.message
      )
    }
  }

  async function deleteArticle(id: FAQArticle['id']) {
    try {
      await faqService.deleteArticle(id, { showLoader: true })
      articleSearch.trigger()
    } catch (error: any) {
      uiService.openErrorModal('Не удалось удалить статью', error.message)
    }
  }

  async function deleteCategory(id: FAQCategory['id']) {
    try {
      await faqService.deleteCategory(id, { showLoader: true })
      await fetchCategoryTree()
    } catch (error: any) {
      uiService.openErrorModal('Не удалось удалить категорию', error.message)
    }
  }

  return {
    articleSearch,
    fetchArticle,
    createArticle,
    deleteArticle,
    categoryTree,
    fetchCategoryTree,
    createCategory,
    updateCategory,
    deleteCategory
  }
})
