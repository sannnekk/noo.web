import { Core } from '@/core/Core'
import type { Poll } from '@/core/data/entities/Poll'
import { entityFactory } from '@/core/utils/entityFactory'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

export const useCreatePollStore = defineStore(
  'polls-module:create-poll',
  () => {
    const pollService = Core.Services.Poll
    const uiService = Core.Services.UI

    const router = useRouter()

    const poll = ref<Poll>(entityFactory<Poll>('poll'))

    async function fetchPoll(id: Poll['id']) {
      try {
        const response = await pollService.getPoll(id, {
          showLoader: true
        })

        if (response.data) {
          poll.value = response.data
        }
      } catch (error: any) {
        uiService.openErrorModal('Не удалось получить опрос', error.message)
      }
    }

    async function savePoll() {
      if (!validatePoll(poll.value)) {
        return
      }

      poll.value.questions = poll.value.questions.map((question, i) => ({
        ...question,
        order: i + 1
      }))

      try {
        let id = poll.value.id

        if (id) {
          await pollService.updatePoll(poll.value.id, poll.value, {
            showLoader: true
          })
        } else {
          const response = await pollService.createPoll(poll.value, {
            showLoader: true
          })

          id = response.data!.id
        }

        uiService.openSuccessModal('Опрос успешно сохранен', undefined, [
          {
            label: 'Ко всем опросам',
            design: 'primary',
            handler: () => {
              router.push('/polls')
            }
          }
        ])
        router.push(`/polls/create-poll${id}`)
      } catch (error: any) {
        uiService.openErrorModal('Не удалось сохранить опрос', error.message)
      }
    }

    function validatePoll(poll: Poll): boolean {
      if (poll.title.length < 3) {
        uiService.openWarningModal('Заголовок должен быть не менее 3 символов')
        return false
      }

      if (poll.title.length > 150) {
        uiService.openWarningModal(
          'Заголовок должен быть не более 150 символов'
        )
        return false
      }

      if (poll.questions.length === 0) {
        uiService.openWarningModal('Опрос должен содержать хотя бы один вопрос')
        return false
      }

      if (poll.stopAt < new Date()) {
        uiService.openWarningModal(
          'Дата окончания опроса должна быть больше текущей даты'
        )
        return false
      }

      if (poll.canVote?.length === 0) {
        uiService.openWarningModal(
          'Выберите хотя бы один вариант доступа к голосованию'
        )
        return false
      }

      if (poll.canSeeResults?.length === 0) {
        uiService.openWarningModal(
          'Выберите хотя бы один вариант доступа к результатам'
        )
        return false
      }

      for (const question of poll.questions) {
        if (question.text.length < 3) {
          uiService.openWarningModal(
            'Текст вопроса должен быть не менее 3 символов'
          )
          return false
        }

        if (question.text.length > 150) {
          uiService.openWarningModal(
            'Текст вопроса должен быть не более 150 символов'
          )
          return false
        }
      }

      return true
    }

    return {
      poll,
      fetchPoll,
      savePoll
    }
  }
)
