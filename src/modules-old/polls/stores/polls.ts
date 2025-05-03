import { useSearch } from '@/composables/useSearch'
import { Core } from '@/core/Core'
import type { Pagination } from '@/core/data/Pagination'
import type { Poll } from '@/core/data/entities/Poll'
import { defineStore } from 'pinia'

export const usePollsStore = defineStore('polls-module:polls', () => {
  const pollService = Core.Services.Poll
  const uiService = Core.Services.UI

  const pollSearch = useSearch(fetchPolls)

  async function fetchPolls(pagination?: Pagination) {
    try {
      return pollService.getPolls(pagination)
    } catch (error: any) {
      uiService.openErrorModal(
        'Не удалось получить список опросов',
        error.message
      )
    }
  }

  async function deletePoll(pollId: Poll['id']) {
    try {
      await pollService.deletePoll(pollId)
      pollSearch.trigger()
    } catch (error: any) {
      uiService.openErrorModal('Не удалось удалить опрос', error.message)
    }
  }

  return {
    pollSearch,
    deletePoll
  }
})
