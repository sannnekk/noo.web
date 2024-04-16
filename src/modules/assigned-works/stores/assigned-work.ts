import type { AssignedWork } from '@/core/data/entities/AssignedWork'
import { defineStore } from 'pinia'
import { ref, computed, watch, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { Task } from '@/core/data/entities/Task'
import { isDeltaEmptyOrWhitespace } from '@/core/utils/deltaHelpers'
import { Core } from '@/core/Core'
import type { ModalAction } from '@/core/services/store/UIStore'

export type ActionType = 'read' | 'solve' | 'check'

export type Visibility = 'visible' | 'readonly' | 'hidden'

export type FieldVisibility = {
  solveBox: Visibility
  checkBox: Visibility
  scoreBox: Visibility
}

export const useAssignedWorkStore = defineStore(
  'assigned-works-module:assigned-work',
  () => {
    const assignedWorkService = Core.Services.AssignedWork
    const uiService = Core.Services.UI
    const _route = useRoute()
    const _router = useRouter()

    /**
     * Mode of the page (read, solve, check)
     */
    const mode = computed<ActionType>(() => _route.params.mode as ActionType)

    /**
     * Modal for sure submit
     */
    const sureSubmitModalVisible = ref(false)
    const sureSubmitModalError = ref('')

    /**
     * Modal for remake work
     */
    const remakeModal = reactive({
      visible: false,
      onlyFalse: false
    })

    /**
     * Modal for shift deadline
     */
    const shiftDeadlineModalVisible = ref(false)

    /**
     * current assigned work
     */
    const assignedWorkId = computed(() => _route.params.workId as string)
    const assignedWork = ref<AssignedWork | null>(null)

    /**
     * Load assigned work
     */
    async function fetchAssignedWork() {
      uiService.setLoading(true)
      try {
        const response = await assignedWorkService.getAssignedWork(
          assignedWorkId.value
        )
        assignedWork.value = response.data

        if (
          mode.value === 'solve' &&
          ['made-in-deadline', 'made-after-deadline'].includes(
            assignedWork.value?.solveStatus || ''
          )
        ) {
          throw new Error('Работа уже сдана и не может быть изменена')
        }

        if (
          mode.value === 'check' &&
          ['not-started', 'in-progress'].includes(
            assignedWork.value?.solveStatus || ''
          )
        ) {
          throw new Error('Работа еще не сдана и не может быть проверена')
        }

        if (
          mode.value === 'check' &&
          ['checked-in-deadline', 'checked-after-deadline'].includes(
            assignedWork.value?.checkStatus || ''
          )
        ) {
          throw new Error('Работа уже проверена и не может быть изменена')
        }
      } catch (e: any) {
        uiService.openErrorModal(
          'Ошибка',
          e?.status === 404
            ? 'Работа не найдена. Возможно, работа была удалена и остался только этот экземпляр'
            : e.message
        )
        assignedWork.value = null
      } finally {
        uiService.setLoading(false)
      }
    }

    /**
     * Base url for the page
     */
    const baseUrl = computed(
      () => `/assigned-works/${assignedWorkId.value}/${mode.value}`
    )

    /**
     * Current task
     */
    const taskSlug = computed(() => _route.params.taskSlug as string)
    const taskId = ref()
    const task = ref()

    /**
     * Watch for task or assigned work change
     */
    watch(
      [taskSlug, assignedWorkId, mode],
      () => {
        if (!assignedWork.value || !taskSlug.value) {
          task.value = null
          taskId.value = null

          return
        }

        const _task = getTaskBySlug(taskSlug.value)

        if (!_task) {
          task.value = null
          taskId.value = null

          return
        }

        taskId.value = _task.id
        task.value = _task
      },
      { immediate: true }
    )

    /**
     * Current work score
     */
    const workScore = computed(() => {
      if (!assignedWork.value) return null

      const role = Core.Context.User!.role

      if (role === 'student' && mode.value === 'read') {
        return assignedWork.value.score || 0
      }

      if (role === 'mentor' && mode.value === 'check') {
        return assignedWork.value.comments.reduce((acc, comment) => {
          return acc + (comment.score || 0)
        }, 0)
      }

      if (
        assignedWork.value.checkStatus === 'checked-in-deadline' ||
        assignedWork.value.checkStatus === 'checked-after-deadline'
      ) {
        return assignedWork.value.score || 0
      }

      return null
    })

    /**
     * Work score text
     */
    const workScoreText = computed(() => {
      if (workScore.value === null) return null

      if (workScore.value === 0) {
        return '0 баллов'
      }

      const lastDigit = workScore.value % 10

      if (workScore.value > 10 && workScore.value < 20) {
        return `${workScore.value} баллов`
      }

      if (lastDigit === 1) {
        return `${workScore.value} балл`
      }

      if (lastDigit > 1 && lastDigit < 5) {
        return `${workScore.value} балла`
      }

      return `${workScore.value} баллов`
    })

    /**
     * Next task link
     */
    const nextTaskLink = computed(() => {
      const currentTaskIndex = assignedWork.value!.work!.tasks.findIndex(
        (task) => task.slug === taskSlug.value
      )!

      if (currentTaskIndex === assignedWork.value!.work!.tasks.length - 1)
        return ''

      const nextTaskSlug =
        assignedWork.value!.work!.tasks[currentTaskIndex + 1]?.slug

      return baseUrl.value + '/' + nextTaskSlug
    })

    /**
     * Previous task link
     */
    const previousTaskLink = computed(() => {
      const currentTaskIndex = assignedWork.value!.work!.tasks.findIndex(
        (task) => task.slug === taskSlug.value
      )!

      if (currentTaskIndex === 0) return ''

      const previousTaskSlug =
        assignedWork.value!.work!.tasks[currentTaskIndex - 1]?.slug

      return baseUrl.value + '/' + previousTaskSlug
    })

    /**
     * Field visibility based on user role and mode
     */
    const fieldVisibility = computed<FieldVisibility>(() => {
      const role = Core.Context.User!.role

      let solveBox: Visibility = 'hidden'
      let checkBox: Visibility = 'hidden'
      let scoreBox: Visibility = 'hidden'

      switch (role) {
        case 'student':
          solveBox = mode.value === 'solve' ? 'visible' : 'readonly'
          checkBox = mode.value === 'solve' ? 'hidden' : 'readonly'
          scoreBox = mode.value === 'solve' ? 'hidden' : 'readonly'
          break
        case 'mentor':
          solveBox = 'readonly'
          checkBox = mode.value === 'check' ? 'visible' : 'readonly'
          scoreBox = mode.value === 'check' ? 'visible' : 'readonly'
          break
        case 'admin':
        case 'teacher':
          solveBox = 'readonly'
          checkBox = 'readonly'
          scoreBox = 'readonly'
          break
      }

      return {
        solveBox,
        checkBox,
        scoreBox
      }
    })

    /**
     * Get task by id
     */
    function getTask(taskId: string) {
      return assignedWork.value?.work?.tasks.find((task) => task.id === taskId)
    }

    /**
     * Get task by slug
     */
    function getTaskBySlug(taskSlug: string) {
      return assignedWork.value?.work?.tasks.find(
        (task) => task.slug === taskSlug
      )
    }

    /**
     * Check if task has answer
     */
    function taskHasAnswer(task: Task): boolean {
      if (mode.value === 'read') return false

      if (!assignedWork.value || !assignedWork.value?.answers) return false

      const answer = assignedWork.value.answers.find(
        (answer) => answer.taskId === task.id
      )

      if (!answer) return false

      switch (task.type) {
        case 'one_choice':
        case 'multiple_choice':
          return !!(
            answer.chosenTaskOptionIds && answer.chosenTaskOptionIds.length > 0
          )
        case 'word':
          return !!(answer.word && answer.word.trim().length > 0)
        case 'text':
          return !isDeltaEmptyOrWhitespace(answer.content)
      }
    }

    /**
     * Get score badge for the task
     */
    function taskScoreStatus(
      task: Task
    ): 'success' | 'warning' | 'error' | null {
      if (
        mode.value === 'solve' ||
        assignedWork.value?.solveStatus === 'not-started' ||
        assignedWork.value?.solveStatus === 'in-progress'
      ) {
        return null
      }

      const comment = assignedWork.value?.comments.find(
        (comment) => comment.taskId === task.id
      )

      if (!comment) {
        if (task.type !== 'text') {
          return 'error'
        }

        return null
      }

      if (
        (assignedWork.value?.checkStatus === 'not-checked' ||
          assignedWork.value?.checkStatus === 'in-progress') &&
        Core.Context.User?.role !== 'mentor'
      ) {
        return null
      }

      if (comment.score === 0) {
        return 'error'
      }
      if (comment.score === task.highestScore) {
        return 'success'
      }

      return 'warning'
    }

    /**
     * Submit work
     */
    async function submitWork() {
      if (!assignedWork.value) return

      const tasks = assignedWork.value!.work?.tasks || []

      if (
        mode.value === 'solve' &&
        !tasks.every((task) => taskHasAnswer(task))
      ) {
        sureSubmitModalError.value = 'Вы не ответили на все вопросы'
      } else {
        sureSubmitModalError.value = ''
      }

      if (!sureSubmitModalVisible.value) {
        sureSubmitModalVisible.value = true
        return
      }

      uiService.setLoading(true)

      const payload = { ...assignedWork.value, work: undefined }

      const onSolvedActions: ModalAction[] = [
        {
          label: 'Вернуться к списку работ',
          design: 'secondary' as const,
          handler: () => {
            _router.push('/assigned-works')
          }
        }
      ]

      if (
        assignedWork.value.work?.tasks.every((task) => task.type !== 'text')
      ) {
        onSolvedActions.unshift({
          label: 'Посмотреть результат',
          design: 'primary' as const,
          handler: () => {
            window.location.href = `/assigned-works/${assignedWorkId.value}/read`
          }
        })
      }

      try {
        if (mode.value === 'solve') {
          await assignedWorkService.solveAssignedWork(
            assignedWork.value.id,
            payload
          )
          uiService.openSuccessModal(
            'Работа успешно сдана!',
            '',
            onSolvedActions
          )
        } else if (mode.value === 'check') {
          await assignedWorkService.checkAssignedWork(
            assignedWork.value.id,
            payload
          )
          uiService.openSuccessModal(
            'Работа успешно проверена!',
            'Если работа без открытых вопросов, она будет проверена автоматически и Вы можете просмотреть результат сразу. В случае работ с хотя б одним открытым вопросом требуется проверка куратора',
            [
              {
                label: 'Вернуться к списку работ',
                design: 'primary',
                handler: () => {
                  _router.push('/assigned-works')
                }
              }
            ]
          )
        }
      } catch (e: any) {
        uiService.openErrorModal('Ошибка при отправке работы', e.message)
      } finally {
        uiService.setLoading(false)
      }
    }

    /**
     * Shift deadline
     */
    async function shiftDeadline() {
      if (mode.value === 'read' || !assignedWork.value) return

      if (!shiftDeadlineModalVisible.value) {
        shiftDeadlineModalVisible.value = true
        return
      }

      uiService.setLoading(true)

      try {
        await assignedWorkService.shiftAssignedWorkDeadline(
          assignedWork.value.id
        )
        uiService.openSuccessModal('Дедлайн успешно сдвинут!')
      } catch (e: any) {
        uiService.openErrorModal('Ошибка при сдвиге дедлайна', e.message)
      } finally {
        uiService.setLoading(false)
      }
    }

    /**
     * Save progress
     */
    async function saveProgress() {
      if (!assignedWork.value) return

      uiService.setLoading(true)

      const payload = { ...assignedWork.value, work: undefined }

      try {
        await assignedWorkService.saveAssignedWorkProgress(
          assignedWork.value.id,
          payload
        )
        uiService.openSuccessModal('Прогресс успешно сохранен!', '', [
          {
            label: 'Вернуться к списку работ',
            design: 'primary',
            handler: () => {
              _router.push('/assigned-works')
            }
          }
        ])
      } catch (e: any) {
        uiService.openErrorModal('Ошибка при сохранении прогресса', e.message)
      } finally {
        uiService.setLoading(false)
      }
    }

    /**
     * Remake work
     */
    async function remakeWork() {
      if (!assignedWork.value) return

      if (assignedWork.value.work?.type !== 'test') {
        uiService.openErrorModal(
          'Ошибка при создании нового экземпляра работы',
          'Можно пересдавать только тестовую работу'
        )
        return
      }

      uiService.setLoading(true)

      try {
        await assignedWorkService.remakeAssignedWork(
          assignedWork.value.id,
          remakeModal.onlyFalse
        )

        uiService.openSuccessModal(
          'Работа успешно создана и появилась в списке!',
          'Если работы нет в списке, попробуйте обновить страницу'
        )
      } catch (e: any) {
        uiService.openErrorModal(
          'Ошибка при создании нового экземпляра работы',
          e.message
        )
      } finally {
        uiService.setLoading(false)
      }
    }

    return {
      assignedWorkId,
      assignedWork,
      taskSlug,
      taskId,
      task,
      sureSubmitModalVisible,
      sureSubmitModalError,
      shiftDeadlineModalVisible,
      shiftDeadline,
      getTask,
      taskHasAnswer,
      taskScoreStatus,
      submitWork,
      mode,
      fieldVisibility,
      baseUrl,
      nextTaskLink,
      previousTaskLink,
      fetchAssignedWork,
      workScoreText,
      workScore,
      saveProgress,
      remakeWork,
      remakeModal
    }
  }
)
