import type { AssignedWork } from '@/core/data/entities/AssignedWork'
import { defineStore } from 'pinia'
import { ref, reactive, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import type { Task } from '@/core/data/entities/Task'
import { isDeltaEmptyOrWhitespace } from '@/core/utils/deltaHelpers'
import { Core } from '@/core/Core'

export type ActionType = 'read' | 'solve' | 'check'

export type Visibility = 'visible' | 'readonly' | 'hidden'

export type FieldVisibility = {
  solveBox: Visibility
  checkBox: Visibility
  scoreBox: Visibility
}

export const useAssignedWorkStore = defineStore(
  'assigned-works:assigned-work-detail',
  () => {
    const assignedWorkService = Core.Services.AssignedWork
    const uiService = Core.Services.UI
    const _route = useRoute()

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
     * Modal for shift deadline
     */
    const shiftDeadlineModalVisible = ref(false)

    /**
     * current assigned work
     */
    const assignedWorkId = computed(() => _route.params.workId as string)
    const assignedWork = ref<AssignedWork | null>(null)

    /**
     * Watch for route change to load assigned work
     */
    watch(
      () => _route.params.workId,
      async () => {
        if (_route.params.workId) {
          uiService.setLoading(true)
          try {
            const response = await assignedWorkService.getAssignedWork(
              _route.params.workId as string
            )
            assignedWork.value = response.data
          } catch (e: any) {
            uiService.openErrorModal('Ошибка при загрузке работы', e.message)
          } finally {
            uiService.setLoading(false)
          }
        }
      },
      { immediate: true }
    )

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
      [taskSlug, assignedWorkId],
      () => {
        if (!assignedWork.value) return

        const _task = getTaskBySlug(taskSlug.value)

        if (!_task) return

        taskId.value = _task.id
        task.value = _task
      },
      { immediate: true }
    )

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
      const answer = assignedWork.value?.answers.find(
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

      try {
        if (mode.value === 'solve') {
          await assignedWorkService.solveAssignedWork(
            assignedWork.value.id,
            assignedWork.value
          )
          uiService.openSuccessModal('Работа успешно сдана!')
        } else if (mode.value === 'check') {
          await assignedWorkService.checkAssignedWork(
            assignedWork.value.id,
            assignedWork.value
          )
          uiService.openSuccessModal('Работа успешно проверена!')
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
      submitWork,
      mode,
      fieldVisibility,
      baseUrl,
      nextTaskLink,
      previousTaskLink
    }
  }
)
