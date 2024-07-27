import { Core } from '@/core/Core'
import type { Poll } from '@/core/data/entities/Poll'
import type { PollAnswer } from '@/core/data/entities/PollAnswer'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { v4 as uuid } from 'uuid'
import type { PollQuestion } from '@/core/data/entities/PollQuestion'
import type { Media } from '@/core/data/entities/Media'

export const usePollStore = defineStore('polls-module:poll', () => {
  const pollService = Core.Services.Poll
  const uiService = Core.Services.UI
  const route = useRoute()

  /**
   * Poll object
   */
  const poll = ref<Poll>()

  /**
   * Answers array
   */
  const answers = ref<PollAnswer[]>([])

  /**
   * Fetch poll function
   */
  async function fetchPoll() {
    try {
      const response = await pollService.getPoll(
        route.params.pollId as string,
        { showLoader: true }
      )

      if (!response?.data) {
        throw new Error('Опрос не найден или недоступен')
      }

      poll.value = response.data
      setAnswers(poll.value.questions)
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

  /**
   * Set answers
   */
  function setAnswers(questions: PollQuestion[]) {
    answers.value = questions.map((question) => emptyAnswer(question))
  }

  /**
   * Create empty answer
   */
  function emptyAnswer(question: PollQuestion): PollAnswer {
    return {
      id: uuid(),
      questionId: question.id,
      questionType: question.type,
      date: new Date(),
      text: '',
      choices: [],
      rating: 0,
      files: [],
      number: 0
    }
  }

  /**
   * Save answers
   */
  async function saveAnswers() {
    if (!poll.value) {
      return
    }

    try {
      validateAnswers(poll.value.questions, answers.value)

      const payload = answers.value.map((answer) => ({
        ...answer,
        id: undefined
      })) as unknown as PollAnswer[]

      await pollService.saveAnswers(poll.value.id, payload, {
        showLoader: true
      })

      uiService.openSuccessModal(
        'Спасибо за участие в опросе!',
        'Ваши ответы успешно сохранены',
        [
          {
            label: 'Назад к блогу/новостям',
            design: 'primary',
            handler: () => window.location.replace('/blog')
          }
        ]
      )
    } catch (error: any) {
      uiService.openErrorModal(
        'Произошла ошибка при сохранении ответов',
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

  function validateAnswers(questions: PollQuestion[], answers: PollAnswer[]) {
    for (const question of questions) {
      const answer = answers.find((a) => a.questionId === question.id)

      if (question.required && !answer) {
        throw new Error(`Ответ на вопрос "${question.text}" обязателен`)
      }

      if (!isAnswerValid(question, answer!)) {
        throw new Error(`Ответ на вопрос "${question.text}" обязателен`)
      }
    }
  }

  function isAnswerValid(question: PollQuestion, answer: PollAnswer) {
    switch (question.type) {
      case 'text':
        return checkTextQuestionType(question, answer.text)
      case 'choice':
        return checkChoiceQuestionType(question, answer.choices)
      case 'rating':
        return checkRatingQuestionType(question, answer.rating)
      case 'number':
        return checkNumberQuestionType(question, answer.number)
      case 'date':
        return checkDateQuestionType(question, answer.date)
      case 'file':
        return checkFileQuestionType(question, answer.files)
      default:
        return false
    }
  }

  function checkTextQuestionType(
    question: PollQuestion,
    answer: string | undefined
  ) {
    if (!question.required && !answer?.length) {
      return true
    }

    if (question.maxLength && question.maxLength < answer!.length) {
      return false
    }

    if (question.minLength && question.minLength > answer!.length) {
      return false
    }

    return true
  }

  function checkNumberQuestionType(
    question: PollQuestion,
    answer: number | undefined
  ) {
    if (!question.required && answer === undefined) {
      return true
    }

    if (answer === undefined) {
      return false
    }

    if (question.maxValue && question.maxValue < answer) {
      return false
    }

    if (question.minValue && question.minValue > answer) {
      return false
    }

    if (question.onlyIntegerValue && !Number.isInteger(answer)) {
      return false
    }

    return true
  }

  function checkChoiceQuestionType(
    question: PollQuestion,
    answer: string[] | undefined
  ) {
    if (!question.required && !answer?.length) {
      return true
    }

    if (answer === undefined) {
      return false
    }

    if (question.minChoices && question.minChoices > answer.length) {
      return false
    }

    if (question.maxChoices && question.maxChoices < answer.length) {
      return false
    }

    return true
  }

  function checkRatingQuestionType(
    question: PollQuestion,
    answer: number | undefined
  ) {
    if (!question.required && answer === undefined) {
      return true
    }

    if (answer === undefined) {
      return false
    }

    if (question.maxRating && question.maxRating < answer) {
      return false
    }

    if (question.minRating && question.minRating > answer) {
      return false
    }

    if (question.onlyIntegerRating && !Number.isInteger(answer)) {
      return false
    }

    return true
  }

  function checkDateQuestionType(
    question: PollQuestion,
    answer: Date | undefined
  ) {
    if (!question.required && !answer) {
      return true
    }

    if (!answer) {
      return false
    }

    if (question.onlyFutureDate && answer < new Date()) {
      return false
    }

    if (question.onlyPastDate && answer > new Date()) {
      return false
    }

    return true
  }

  function checkFileQuestionType(
    question: PollQuestion,
    answer: Media[] | undefined
  ) {
    if (!question.required && !answer?.length) {
      return true
    }

    if (!answer?.length) {
      return false
    }

    // file size is checked on the server

    if (question.maxFileCount && question.maxFileCount < answer.length) {
      return false
    }

    for (const file of answer) {
      if (
        question.allowedFileTypes &&
        !question.allowedFileTypes.includes(file.mimeType)
      ) {
        return false
      }
    }

    return true
  }

  return {
    poll,
    fetchPoll,
    answers,
    saveAnswers
  }
})
