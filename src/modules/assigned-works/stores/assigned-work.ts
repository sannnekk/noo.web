import type { AssignedWork } from '@/core/data/entities/AssignedWork'
import { defineStore } from 'pinia'
import { ref, computed, watch, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { Task } from '@/core/data/entities/Task'
import { isDeltaEmptyOrWhitespace } from '@/core/utils/deltaHelpers'
import { Core } from '@/core/Core'
import type { ModalAction } from '@/core/services/store/UIStore'
import { debounce } from '@/core/utils/debounce'
import type { ReadableWorkScore } from '../types/ReadableWorkScore'
import type { AssignedWorkViewMode } from '../types/AssignedWorkViewMode'
import { getTaskScoreStatus, isCheckedAutomatically } from '../utils/task'

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
    const mode = computed<AssignedWorkViewMode>(
      () => _route.params.mode as AssignedWorkViewMode
    )

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
      try {
        const response = await assignedWorkService.getAssignedWork(
          assignedWorkId.value,
          {
            showLoader: true
          }
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
    const task = computed(() => getTaskBySlug(taskSlug.value) || null)

    /**
     * Current work score
     */
    const workScore = computed<ReadableWorkScore>(() => {
      if (!assignedWork.value) {
        return {
          value: 0,
          of: 0,
          percentage: 0
        }
      }

      if (mode.value === 'check') {
        const value = assignedWork.value.comments.reduce((acc, comment) => {
          return acc + (comment.score || 0)
        }, 0)

        const of = assignedWork.value.maxScore

        const percentage = Number(
          of === 0 ? 0 : ((value / of) * 100).toFixed(2)
        )

        return {
          value,
          of,
          percentage
        }
      }

      const score =
        assignedWork.value.score === null ? 0 : assignedWork.value.score
      const maxScore = assignedWork.value.maxScore

      const percentage = Number(
        assignedWork.value.score === 0
          ? 0
          : ((score / maxScore) * 100).toFixed(2)
      )

      return {
        value: score,
        of: maxScore,
        percentage
      }
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
        case 'word':
          return !!(answer.word && answer.word.trim().length > 0)
        case 'text':
        case 'essay':
        case 'final-essay':
          return !!(answer.content && !isDeltaEmptyOrWhitespace(answer.content))
      }
    }

    /**
     * Get score badge for the task
     */
    function taskScoreStatus(
      task: Task
    ): 'success' | 'warning' | 'error' | null {
      if (!assignedWork.value) {
        return null
      }

      return getTaskScoreStatus(task, assignedWork.value!, mode.value)
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

      const onSolvedActions: ModalAction[] = [
        {
          label: 'Вернуться к списку работ',
          design: 'secondary' as const,
          handler: () => {
            window.location.href = '/assigned-works'
          }
        }
      ]

      if (
        assignedWork.value.work?.tasks.every((task) =>
          isCheckedAutomatically(task.type)
        )
      ) {
        onSolvedActions.unshift({
          label: 'Посмотреть результат',
          design: 'primary',
          handler: () => {
            window.location.href = `/assigned-works/${assignedWorkId.value}/read`
          }
        })
      }

      try {
        if (mode.value === 'solve') {
          await assignedWorkService.solveAssignedWork(
            assignedWork.value.id,
            {
              answers: assignedWork.value.answers,
              studentComment: assignedWork.value.studentComment || null
            },
            { showLoader: true }
          )
          uiService.openSuccessModal(
            'Работа успешно сдана!',
            'Если работа без открытых вопросов, она будет проверена автоматически и Вы можете просмотреть результат сразу. В случае работ с хотя бы одним открытым вопросом требуется проверка куратора',
            onSolvedActions
          )
        } else if (mode.value === 'check') {
          await assignedWorkService.checkAssignedWork(
            assignedWork.value.id,
            {
              // send answers even though its only check - text&image comments are stored in answers
              answers: assignedWork.value.answers,
              comments: assignedWork.value.comments,
              mentorComment: assignedWork.value.mentorComment || null
            },
            { showLoader: true }
          )
          uiService.openSuccessModal('Работа успешно проверена!', '', [
            {
              label: 'Вернуться к списку работ',
              design: 'primary',
              handler: () => {
                window.location.href = '/assigned-works'
              }
            }
          ])
        }
      } catch (e: any) {
        uiService.openErrorModal('Ошибка при отправке работы', e.message)
      }
    }

    /**
     * Auto save block
     */
    const autoSave = reactive({
      enabled: false,
      state: 'unset' as 'unset' | 'error' | 'success',
      loading: false,
      reset() {
        autoSave.state = 'unset'
        autoSave.enabled = false
      }
    })

    watch(assignedWork, debounce(triggerAutoSave, 5000), { deep: true })

    async function triggerAutoSave() {
      if (
        !assignedWork.value ||
        !autoSave.enabled ||
        autoSave.loading ||
        mode.value === 'read'
      ) {
        return
      }

      autoSave.loading = true

      const payload = {
        answers: assignedWork.value.answers,
        comments: assignedWork.value.comments,
        studentComment: assignedWork.value.studentComment || null,
        mentorComment: assignedWork.value.mentorComment || null
      }

      try {
        await assignedWorkService.saveAssignedWorkProgress(
          assignedWork.value.id,
          payload
        )

        autoSave.state = 'success'

        if (mode.value === 'check') {
          assignedWork.value.checkStatus === 'not-checked'
        } else {
          assignedWork.value.solveStatus = 'in-progress'
        }
      } catch (e: any) {
        autoSave.state = 'error'
      }

      autoSave.loading = false
    }

    /**
     * Settings block
     */
    const settings = reactive({
      showCheckHints: true,
      showSolveHints: true
    })

    /**
     * Shift deadline
     */
    async function shiftDeadline() {
      if (mode.value === 'read' || !assignedWork.value) return

      if (!shiftDeadlineModalVisible.value) {
        shiftDeadlineModalVisible.value = true
        return
      }

      try {
        const response = await assignedWorkService.shiftAssignedWorkDeadline(
          assignedWork.value.id,
          { showLoader: true }
        )
        uiService.openSuccessModal('Дедлайн успешно сдвинут!')

        assignedWork.value.solveDeadlineAt = response.data!.newSolveDeadlineAt
        assignedWork.value.checkDeadlineAt = response.data!.newCheckDeadlineAt
      } catch (e: any) {
        uiService.openErrorModal('Ошибка при сдвиге дедлайна', e.message)
      }
    }

    /**
     * Save progress
     */
    async function saveProgress() {
      if (!assignedWork.value) return

      const payload = {
        answers: assignedWork.value.answers,
        comments: assignedWork.value.comments,
        studentComment: assignedWork.value.studentComment || null,
        mentorComment: assignedWork.value.mentorComment || null
      }

      try {
        await assignedWorkService.saveAssignedWorkProgress(
          assignedWork.value.id,
          payload,
          { showLoader: true }
        )
        uiService.openSuccessModal('Прогресс успешно сохранен!', '', [
          {
            label: 'Вернуться к списку работ',
            design: 'primary',
            handler: () => {
              window.location.href = '/assigned-works'
            }
          }
        ])

        if (Core.Context.roleIs(['student'])) {
          assignedWork.value.solveStatus = 'in-progress'
        } else if (Core.Context.roleIs(['mentor'])) {
          assignedWork.value.checkStatus = 'in-progress'
        }
      } catch (e: any) {
        uiService.openErrorModal('Ошибка при сохранении прогресса', e.message)
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
          'Можно пересдавать только тестовую работу. Эта работа содержит открытые вопросы'
        )
        return
      }

      try {
        await assignedWorkService.remakeAssignedWork(
          assignedWork.value.id,
          remakeModal.onlyFalse,
          { showLoader: true }
        )

        uiService.openSuccessModal(
          'Работа успешно создана и появилась в списке!',
          'Если работы нет в списке, попробуйте обновить страницу',
          [
            {
              label: 'Вернуться к списку работ',
              design: 'primary',
              handler: () => {
                window.location.href = '/assigned-works'
              }
            }
          ]
        )
      } catch (e: any) {
        uiService.openErrorModal(
          'Ошибка при создании нового экземпляра работы',
          e.message
        )
      }
    }

    /**
     * Recheck automatically
     */
    async function recheckAutomatically() {
      if (!assignedWork.value) {
        return
      }

      try {
        await assignedWorkService.recheckAutomatically(assignedWork.value.id, {
          showLoader: true
        })
        await fetchAssignedWork()
        uiService.openSuccessModal('Работа успешно перепроверена')
      } catch (error: any) {
        uiService.openErrorModal(
          'Ошибка при автоматической проверке',
          error.message
        )
      }
    }

    return {
      assignedWorkId,
      assignedWork,
      taskSlug,
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
      baseUrl,
      nextTaskLink,
      previousTaskLink,
      fetchAssignedWork,
      workScore,
      saveProgress,
      recheckAutomatically,
      remakeWork,
      remakeModal,
      _router,
      autoSave,
      settings
    }
  }
)
