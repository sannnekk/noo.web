import { useSearch } from '@/composables/useSearch'
import { Core } from '@/core/Core'
import type { Pagination } from '@/core/data/Pagination'
import type { Poll } from '@/core/data/entities/Poll'
import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

export const usePollResultsStore = defineStore('polls-module:results', () => {
  const pollService = Core.Services.Poll
  const uiService = Core.Services.UI
  const route = useRoute()

  /**
   * Current poll id
   */
  const pollId = computed(() => route.params.pollId as string)

  /**
   * Poll object
   */
  const poll = ref<Poll>()

  /**
   * Current tab index
   */
  const currentTabIndex = ref(0)

  watch(currentTabIndex, (index) => {
    if (index === 1) {
      unregisteredResultsSearch.triggerOnce()
    }
  })

  /**
   * Search who voted
   */
  const resultsSearch = useSearch(fetchAnswers)

  /**
   * Search who voted (unregistered users)
   */
  const unregisteredResultsSearch = useSearch(fetchUnregisteredAnswers, {
    immediate: false
  })

  /**
   * Fetch answers
   */
  async function fetchAnswers(pagination?: Pagination) {
    if (!pollId.value) {
      return [] as any
    }

    try {
      return await pollService.searchWhoVoted(pollId.value, pagination)
    } catch (error: any) {
      uiService.openErrorModal(
        'Произошла ошибка при получении ответов',
        error.message
      )
    }
  }

  /**
   * Fetch answers (unregistered users)
   */
  async function fetchUnregisteredAnswers(pagination?: Pagination) {
    if (!pollId.value) {
      return [] as any
    }

    try {
      return await pollService.searchWhoVotedUnregistered(
        pollId.value,
        pagination
      )
    } catch (error: any) {
      uiService.openErrorModal(
        'Произошла ошибка при получении ответов',
        error.message
      )
    }
  }

  /**
   * Fetch poll
   */
  async function fetchPoll() {
    try {
      const response = await pollService.getPollInfo(pollId.value, {
        showLoader: true
      })

      poll.value = response.data!
    } catch (error: any) {
      uiService.openErrorModal(
        'Произошла ошибка при получении опроса',
        error.message,
        [
          {
            label: 'Назад к блогу/новостям',
            design: 'primary',
            handler: () => window.location.replace('/blog')
          }
        ]
      )
    }
  }

  return {
    poll,
    currentTabIndex,
    resultsSearch,
    unregisteredResultsSearch,
    fetchPoll
  }
})
