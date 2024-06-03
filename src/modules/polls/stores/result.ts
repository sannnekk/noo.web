import { Core } from '@/core/Core'
import type { Poll } from '@/core/data/entities/Poll'
import type { PollAnswer } from '@/core/data/entities/PollAnswer'
import type { User } from '@/core/data/entities/User'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'

export const useUserResultStore = defineStore(
  'polls-module:user-result',
  () => {
    const uiService = Core.Services.UI
    const pollService = Core.Services.Poll
    const userService = Core.Services.User
    const route = useRoute()

    /**
     * Users poll answers
     */
    const answers = ref<PollAnswer[]>([] as PollAnswer[])

    /**
     * Answer to edit
     */
    const answerToEdit = ref<PollAnswer>()

    /**
     * Current question
     */
    const currentQuestion = computed(() =>
      poll.value?.questions.find((q) => q.id === answerToEdit.value?.questionId)
    )

    /**
     * Username from route params
     */
    const username = computed(() => route.params.username as string)

    /**
     * Poll ID from route params
     */
    const pollId = computed(() => route.params.pollId as string)

    /**
     * Poll
     */
    const poll = ref<Poll>()

    /**
     * User
     */
    const user = ref<User>()

    /**
     * Load user poll answers
     */
    async function fetchAnswers() {
      uiService.setLoading(true)

      try {
        await fetchUser()
        await fetchPoll()

        if (!user.value) {
          throw new Error('Пользователь не найден')
        }

        const response = await pollService.getAnswers(
          pollId.value,
          user.value.id
        )

        answers.value = response.data
      } catch (error: any) {
        uiService.openErrorModal(
          'Не удалось загрузить ответы пользователя',
          error.message
        )
      } finally {
        uiService.setLoading(false)
      }
    }

    /**
     * Load user
     */
    async function fetchUser() {
      uiService.setLoading(true)

      try {
        const response = await userService.getUser(username.value)
        user.value = response.data!
      } catch (error: any) {
        uiService.openErrorModal(
          'Не удалось загрузить пользователя',
          error.message
        )
      } finally {
        uiService.setLoading(false)
      }
    }

    /**
     * Load poll
     */
    async function fetchPoll() {
      uiService.setLoading(true)

      try {
        const response = await pollService.getPoll(pollId.value)
        poll.value = response.data!
      } catch (error: any) {
        uiService.openErrorModal('Не удалось загрузить опрос', error.message)
      } finally {
        uiService.setLoading(false)
      }
    }

    /**
     * Submit edited answer
     */
    async function submitAnswer() {
      uiService.setLoading(true)

      if (!answerToEdit.value) {
        uiService.openErrorModal('Ответ не выбран')
        return
      }

      try {
        await pollService.editAnswer(answerToEdit.value.id, answerToEdit.value)
        uiService.openSuccessModal('Ответы сохранены')
      } catch (error: any) {
        uiService.openErrorModal('Не удалось сохранить ответы', error.message)
      } finally {
        uiService.setLoading(false)
      }
    }

    return {
      user,
      poll,
      answers,
      fetchAnswers,
      submitAnswer,
      answerToEdit,
      currentQuestion
    }
  }
)
