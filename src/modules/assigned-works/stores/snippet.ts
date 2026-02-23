import { Core } from '@/core/Core'
import type { Snippet } from '@/core/data/entities/Snippet'
import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { useAssignedWorkStore } from './assigned-work'

export const useSnippetStore = defineStore(
  'assigned-work-module:snippet',
  () => {
    const snippetService = Core.Services.Snippet
    const uiService = Core.Services.UI

    const assignedWorkStore = useAssignedWorkStore()

    const snippets = ref<Snippet[]>([])

    const snippetModalOpen = ref(false)

    async function fetchSnippets() {
      if (assignedWorkStore.mode !== 'check') {
        snippets.value = []
        return
      }

      try {
        const response = await snippetService.getSnippets()
        snippets.value = response.data
      } catch (error: any) {
        uiService.openErrorModal('Не удалось загрузить сниппеты', error.message)
      }
    }

    watch(() => assignedWorkStore.mode, fetchSnippets, { immediate: true })

    return {
      snippetModalOpen,
      snippets,
      fetchSnippets
    }
  }
)
