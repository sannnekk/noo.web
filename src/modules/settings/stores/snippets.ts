import { Core } from '@/core/Core'
import type { Snippet } from '@/core/data/entities/Snippet'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSnippetStore = defineStore('settings-module:snippets', () => {
  const SnippetService = Core.Services.Snippet
  const uiService = Core.Services.UI

  const moduleLoading = ref(false)
  const snippets = ref<Snippet[]>([])

  async function fetchSnippets() {
    moduleLoading.value = true

    try {
      const result = await SnippetService.getSnippets()
      snippets.value = result.data
    } catch (error: any) {
      uiService.openErrorModal('Ошибка при загрузке сниппетов', error.message)
    } finally {
      moduleLoading.value = false
    }
  }

  async function createSnippet(data: Omit<Snippet, 'id'>) {
    moduleLoading.value = true

    try {
      await SnippetService.createSnippet(data)
      await fetchSnippets()
    } catch (error: any) {
      uiService.openErrorModal('Ошибка при создании сниппета', error.message)
    } finally {
      moduleLoading.value = false
    }
  }

  async function updateSnippet(data: Snippet) {
    moduleLoading.value = true

    try {
      await SnippetService.updateSnippet(data.id, data)
      await fetchSnippets()
    } catch (error: any) {
      uiService.openErrorModal('Ошибка при обновлении сниппета', error.message)
    } finally {
      moduleLoading.value = false
    }
  }

  async function deleteSnippet(snippet: Snippet) {
    moduleLoading.value = true

    try {
      await SnippetService.deleteSnippet(snippet.id)
      await fetchSnippets()
    } catch (error: any) {
      uiService.openErrorModal('Ошибка при удалении сниппета', error.message)
    } finally {
      moduleLoading.value = false
    }
  }

  return {
    moduleLoading,
    snippets,
    fetchSnippets,
    createSnippet,
    updateSnippet,
    deleteSnippet
  }
})
