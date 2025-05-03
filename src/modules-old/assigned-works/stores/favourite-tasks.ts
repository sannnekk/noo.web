import { Core } from '@/core/Core'
import type { FavouriteTask } from '@/core/data/entities/FavouriteTask'
import type { Subject } from '@/core/data/entities/Subject'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { automatedCheck } from '../utils/automated-checks'

export const useFavoriteTaskStore = defineStore(
  'assigned-works-module:favorite-tasks',
  () => {
    const uiService = Core.Services.UI
    const assignedWorkService = Core.Services.AssignedWork

    const quizData = ref({
      state: 'form' as 'form' | 'quiz' | 'result',
      subjectId: null as Subject['id'] | null,
      cardsCount: 10,
      deleteCorrect: true,
      currentAnswer: '',
      currentFavouriteTask: null as FavouriteTask | null,
      previousFavouriteTask: null as FavouriteTask | null,
      nextFavouriteTask: null as FavouriteTask | null,
      favouriteTasks: [] as FavouriteTask[],
      results: new Map<
        string,
        {
          isCorrect: boolean
          answer: string
        }
      >(), // <favouriteTaskId, ...>
      toDeleteIds: new Set<string>()
    })

    const errors = ref<string[]>([])

    const correctCount = computed(
      () =>
        Array.from(quizData.value.results.values())
          .map((val) => val.isCorrect)
          .filter(Boolean).length
    )
    const correctPercentage = computed(() => {
      const correct = correctCount.value
      const total = totalCount.value

      return total ? Math.round((correct / total) * 100) : 0
    })
    const totalCount = computed(() => quizData.value.favouriteTasks.length)

    const isCurrentTaskSolved = computed(() => {
      const favouriteTaskId = quizData.value.currentFavouriteTask?.id

      if (!favouriteTaskId) {
        return false
      }

      return quizData.value.results.has(favouriteTaskId)
    })

    async function fetchFavouriteTasks() {
      if (!quizData.value.subjectId) {
        errors.value.push('Не выбран предмет')
        return
      }

      errors.value = []

      try {
        const response = await assignedWorkService.getFavoriteTasks(
          {
            limit: quizData.value.cardsCount,
            subjectId: quizData.value.subjectId
          },
          { showLoader: true }
        )

        if (!response.data?.length) {
          uiService.openErrorModal('Не найдено сохраненных заданий')
          return
        }

        quizData.value.favouriteTasks = response.data
      } catch (error: any) {
        uiService.openErrorModal(
          'Ошибка при получении сохраненных заданий',
          error.message
        )
      }
    }

    async function startQuiz() {
      await fetchFavouriteTasks()

      if (errors.value.length || !quizData.value.favouriteTasks.length) {
        return
      }

      quizData.value.state = 'quiz'
      quizData.value.currentFavouriteTask = quizData.value.favouriteTasks[0]
      quizData.value.nextFavouriteTask =
        quizData.value.favouriteTasks.at(1) ||
        quizData.value.favouriteTasks.at(0)! // next or first
      quizData.value.previousFavouriteTask =
        quizData.value.favouriteTasks.at(-1)! // last
    }

    function previousCard() {
      const currentTask = quizData.value.currentFavouriteTask
      const previousTask = quizData.value.previousFavouriteTask

      if (!currentTask || !previousTask) {
        return
      }

      quizData.value.currentAnswer =
        quizData.value.results.get(previousTask.id)?.answer || ''

      quizData.value.nextFavouriteTask = currentTask
      quizData.value.currentFavouriteTask = previousTask

      const previousIndex = quizData.value.favouriteTasks.indexOf(previousTask!)

      quizData.value.previousFavouriteTask =
        quizData.value.favouriteTasks.at(previousIndex - 1) ||
        quizData.value.favouriteTasks.at(-1)!
    }

    function nextCard() {
      const currentTask = quizData.value.currentFavouriteTask
      const nextTask = quizData.value.nextFavouriteTask

      if (!currentTask || !nextTask) {
        return
      }

      quizData.value.currentAnswer =
        quizData.value.results.get(nextTask.id)?.answer || ''

      quizData.value.previousFavouriteTask = currentTask
      quizData.value.currentFavouriteTask = nextTask

      const nextIndex = quizData.value.favouriteTasks.indexOf(nextTask)

      quizData.value.nextFavouriteTask =
        quizData.value.favouriteTasks.at(nextIndex + 1) ||
        quizData.value.favouriteTasks.at(0)!
    }

    function submitAnswer() {
      const currentTask = quizData.value.currentFavouriteTask?.task
      const favouriteTaskId = quizData.value.currentFavouriteTask?.id
      const answer = quizData.value.currentAnswer.trim()

      if (!answer || !currentTask || !favouriteTaskId) {
        return
      }

      const score = automatedCheck(currentTask, answer)
      const isCorrect = score === currentTask.highestScore

      if (isCorrect && quizData.value.deleteCorrect) {
        quizData.value.toDeleteIds.add(currentTask.id)
      }

      quizData.value.results.set(favouriteTaskId, {
        isCorrect,
        answer
      })
    }

    function restartQuiz() {
      quizData.value.results.clear()
      quizData.value.toDeleteIds.clear()
      quizData.value.currentAnswer = ''

      // Shuffle tasks
      quizData.value.favouriteTasks.sort(() => Math.random() - 0.5)

      quizData.value.state = 'quiz'
    }

    function exitQuiz() {
      quizData.value.results.clear()
      quizData.value.toDeleteIds.clear()
      quizData.value.currentAnswer = ''
      quizData.value.state = 'form'
    }

    async function endQuiz() {
      quizData.value.state = 'result'

      if (quizData.value.toDeleteIds.size && quizData.value.deleteCorrect) {
        await assignedWorkService.removeTasksFromFavourites(
          Array.from(quizData.value.toDeleteIds),
          { showLoader: true }
        )
      }

      quizData.value.toDeleteIds.clear()
    }

    async function deleteCurrentCard() {
      const id = quizData.value.currentFavouriteTask?.task?.id

      if (!id) {
        return
      }

      try {
        await assignedWorkService.removeTaskFromFavourites(id, {
          showLoader: true
        })

        if (totalCount.value === 1) {
          quizData.value.favouriteTasks = []
          quizData.value.state = 'form'
          return
        }

        nextCard()

        quizData.value.favouriteTasks = quizData.value.favouriteTasks.filter(
          (task) => task.task?.id !== id
        )
      } catch (error: any) {
        uiService.openErrorModal('Ошибка при удалении карточки', error.message)
      }
    }

    return {
      quizData,
      errors,
      correctCount,
      correctPercentage,
      totalCount,
      startQuiz,
      endQuiz,
      previousCard,
      nextCard,
      submitAnswer,
      isCurrentTaskSolved,
      deleteCurrentCard,
      restartQuiz,
      exitQuiz
    }
  }
)
