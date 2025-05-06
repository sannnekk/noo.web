import { defineStore } from 'pinia'
import {
  computed,
  ref,
  shallowRef,
  type Ref,
  type ShallowRef,
  type ComputedRef
} from 'vue'
import type {
  AssignedWorkAnswerEntity,
  AssignedWorkEntity
} from '../api/assigned-work.types'
import { AssignedWorkService } from '../api/assigned-work.service'
import { useGlobalUIStore } from '@/core/stores/global-ui.store'
import { useSaveStatus } from '@/core/composables/useSaveStatus'
import type { PossiblyUnsavedAnswer, TaskGrid } from '../types'
import {
  useApiRequest,
  type UseApiRequestReturn
} from '@/core/composables/useApiRequest'

export interface AssignedWorkDetailStore {
  assignedWork: ShallowRef<AssignedWorkEntity | undefined>
  answers: Ref<Record<string, PossiblyUnsavedAnswer>>
  taskGrid: ComputedRef<TaskGrid>
  saveStatus: ReturnType<typeof useSaveStatus>
  isStateSaved: ComputedRef<boolean>
  init: (assignedWorkId: string) => Promise<boolean>
  save: () => Promise<void>
  shiftDeadline: UseApiRequestReturn
  getTask: (taskId: string) => WorkTaskEntity | undefined
  reset: () => void
}

const useAssignedWorkDetailStore = defineStore(
  'assigned-works:assigned-work-detail',
  (): AssignedWorkDetailStore => {
    const globalUiStore = useGlobalUIStore()

    /**
     * The assigned work entity.
     */
    const assignedWork = shallowRef<AssignedWorkEntity>()

    /**
     * Map of the answers with task IDs as keys.
     */
    const answers = ref<Record<string, PossiblyUnsavedAnswer>>({})

    /**
     * If all answers are saved or not.
     */
    const isStateSaved = computed<boolean>(() =>
      Object.values(answers.value).some((answer) => answer.isSaved === false)
    )

    /**
     * The grid to navigate through the tasks.
     */
    const taskGrid = computed<TaskGrid>(getTaskGrid)

    /**
     * The assigned work save status.
     */
    const saveStatus = useSaveStatus()

    /**
     * Store init function.
     * Must be called before using the store in the beforeEnter hook of the route.
     *
     * @param assignedWorkId - The ID of the assigned work to load.
     */
    async function init(assignedWorkId: string): Promise<boolean> {
      if (assignedWork.value?.id === assignedWorkId) {
        return true
      }

      globalUiStore.setLoading(true, undefined, 'Загрузка работы...')

      const apiResponse = await AssignedWorkService.getById(assignedWorkId)

      if (apiResponse.error) {
        globalUiStore.setLoading(false)
        globalUiStore.createApiErrorToast(
          'Не удалось загрузить работу',
          apiResponse.error ?? undefined
        )
        return false
      }

      assignedWork.value = apiResponse.data
      setSavedAnswers(apiResponse.data.answers || [])
      globalUiStore.setLoading(false)
      return true
    }

    /**
     * Saves the answers to the server.
     */
    async function save(): Promise<void> {
      const changedAnswers = getChangedAnswers()

      if (changedAnswers.length === 0) {
        globalUiStore.createSuccessToast('Работа сохранена')
        return
      }

      globalUiStore.setLoading(true, undefined, 'Сохранение работы...')

      const response = await AssignedWorkService.saveAnswers(
        changedAnswers as AssignedWorkAnswerEntity[]
      )

      if (response.error) {
        globalUiStore.setLoading(false)
        globalUiStore.createApiErrorToast(
          'Не удалось сохранить работу',
          response.error ?? undefined
        )
        return
      }

      setSavedAnswerIds(response.data)
      globalUiStore.setLoading(false)
      saveStatus.pushSaveStatus()
    }

    /**
     * Shifts the deadline request
     */
    const shiftDeadline = useApiRequest(
      () => AssignedWorkService.shiftDeadline(assignedWork.value!.id),
      () => globalUiStore.createSuccessToast('Дедлайн успешно сдвинут')
    )

    /**
     * Resets the assigned work and answers.
     * Must be called when the user navigates away from the page or when the assigned work is changed.
     * This is to prevent data leaks between different assigned works.
     */
    function reset(): void {
      assignedWork.value = undefined
      answers.value = {}
      saveStatus.reset()
    }

    /**
     * Gets the answers that are not saved yet.
     *
     * @returns The array of changed answers
     */
    function getChangedAnswers(): PossiblyUnsavedAnswer[] {
      return Object.values(answers.value).filter(
        (answer) => answer.isSaved !== true
      )
    }

    /**
     * Gets the task by ID.
     */
    function getTask(taskId: string): WorkTaskEntity | undefined {
      return assignedWork.value?.work?.tasks.find((task) => task.id === taskId)
    }

    /**
     * Sets the saved answers to the store.
     *
     * @param newAnswers The array of assigned work answers to set.
     */
    function setSavedAnswers(newAnswers: AssignedWorkAnswerEntity[]): void {
      answers.value = newAnswers.reduce((acc, answer) => {
        acc[answer.taskId] = {
          ...answer,
          isSaved: true
        }
        return acc
      }, {} as Record<string, PossiblyUnsavedAnswer>)
    }

    /**
     * Marks the answers as saved and sets their IDs.
     *
     * @param answerIds The map with task IDs as keys and answer IDs as values.
     */
    function setSavedAnswerIds(answerIds: Record<string, string>): void {
      for (const [taskId, answerId] of Object.entries(answerIds)) {
        const answer = answers.value[taskId]

        if (answer) {
          answer.id = answerId
          answer.isSaved = true
        }
      }
    }

    /**
     * Gets the task grid for the assigned work.
     * This is used to navigate through the tasks in the assigned work.
     */
    function getTaskGrid(): TaskGrid {
      if (!assignedWork.value) {
        return []
      }

      const tasks = assignedWork.value.work.tasks
      const taskGrid: TaskGrid = []

      for (const task of tasks) {
        const answer = answers.value[task.id]

        taskGrid.push({
          hasAnswer: !!answer,
          checkStatus: getAnswerCheckStatus(answer)
        })
      }

      return taskGrid
    }

    /**
     * Gets the check status of the answer.
     *
     * @param answer The answer to get the check status for.
     * @returns The check status of the answer.
     */
    function getAnswerCheckStatus(
      answer: PossiblyUnsavedAnswer
    ): 'none' | 'correct' | 'incorrect' | 'partially-correct' {
      return answer?.score
        ? answer.score === answer.maxScore
          ? 'correct'
          : answer.score > 0
          ? 'partially-correct'
          : 'incorrect'
        : 'none'
    }

    return {
      assignedWork,
      answers,
      init,
      save,
      shiftDeadline,
      saveStatus,
      isStateSaved,
      getTask,
      taskGrid,
      reset
    }
  }
)

export { useAssignedWorkDetailStore }
