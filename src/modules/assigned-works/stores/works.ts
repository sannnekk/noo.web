import type { AssignedWork } from '@/types/entities/AssignedWork'
import { defineStore } from 'pinia'
import { ref, reactive, computed, watch } from 'vue'
import { useGlobalStore } from '@/store'
import { useRoute, useRouter } from 'vue-router'
import type { Task } from '@/types/entities/Task'
import { isDeltaEmptyOrWhitespace } from '@/utils/deltaHelpers'
import { http } from '@/utils/http'

export type ActionType = 'read' | 'solve' | 'check'

export type UserAction = {
  action: string
  link: (id: string) => `/assigned-works/${typeof id}/${ActionType}`
  icon: string
}

export type Visibility = 'visible' | 'readonly' | 'hidden'

export type FieldVisibility = {
  solveBox: Visibility
  checkBox: Visibility
  scoreBox: Visibility
}

export const useAssignedWorksStore = defineStore('assigned-works', () => {
  const _globalStore = useGlobalStore()
  const _route = useRoute()
  const _router = useRouter()

  const mode = computed<ActionType>(() => _route.params.mode as ActionType)

  const sureSubmitModalVisible = ref(false)
  const sureSubmitModalError = ref('')

  const shiftDeadlineModalVisible = ref(false)

  const works = reactive<AssignedWork[]>([])

  _globalStore.setLoading(true)

  const assignedWorkId = computed(() => _route.params.workId as string)
  const assignedWork = ref<AssignedWork>()

  watch(
    () => _route.path,
    () => {
      if (_route.path === '/assigned-works') {
        http
          .get('/assigned-work')
          .then((response) => {
            works.splice(0, works.length)
            works.push(...response)
          })
          .catch(() => {
            _globalStore.openModal('error', 'Не удалось загрузить работы')
          })
          .finally(() => {
            _globalStore.setLoading(false)
          })
      }
    },
    { immediate: true }
  )

  watch(
    () => _route.params.workId,
    () => {
      if (_route.params.workId) {
        _globalStore.setLoading(true)
        http
          .get(`/assigned-work/${assignedWorkId.value}`)
          .then((data) => (assignedWork.value = data))
          .finally(() => _globalStore.setLoading(false))
      }
    },
    { immediate: true }
  )

  const baseUrl = computed(
    () => `/assigned-works/${assignedWorkId.value}/${mode.value}`
  )

  const taskSlug = computed(() => _route.params.taskSlug as string)
  const taskId = ref()

  watch(
    [taskSlug, works],
    () => {
      if (!assignedWork.value) return ''

      const task = assignedWork.value.work!.tasks.find(
        (task) => task.slug === taskSlug.value
      )

      return task?.id
    },
    { immediate: true }
  )
  const task = ref()

  watch(
    [works, taskSlug, assignedWorkId],
    () => {
      task.value = getTaskBySlug(taskSlug.value)
    },
    {
      immediate: true
    }
  )

  const nextTaskLink = computed(() => {
    const currentTaskIndex = assignedWork.value!.work!.tasks.findIndex(
      (task) => task.slug === taskSlug.value
    )!
    const nextTaskSlug =
      assignedWork.value!.work!.tasks[currentTaskIndex + 1]?.slug

    return nextTaskSlug ? baseUrl.value + '/' + nextTaskSlug : ''
  })

  const search = ref('')

  const fieldVisibility = computed<FieldVisibility>(() => {
    const role = _globalStore.getUserRole()!

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

  function getUserAction(assignedWork: AssignedWork): UserAction {
    const role = _globalStore.getUserRole()!

    if (role === 'admin' || role === 'teacher') {
      return {
        action: 'Просмотреть',
        link: (id: string) => `/assigned-works/${id}/read`,
        icon: ''
      }
    }

    if (role === 'mentor') {
      if (
        assignedWork.solveStatus === 'not-started' ||
        assignedWork.solveStatus === 'in-progress'
      ) {
        return {
          action: 'Просмотреть',
          link: (id: string) => `/assigned-works/${id}/read`,
          icon: 'cross-red'
        }
      }

      if (assignedWork.checkStatus === 'not-checked') {
        return {
          action: 'Проверить',
          link: (id: string) => `/assigned-works/${id}/check`,
          icon: 'attention-yellow'
        }
      }

      if (assignedWork.checkStatus === 'in-progress') {
        return {
          action: 'Продолжить проверку',
          link: (id: string) => `/assigned-works/${id}/check`,
          icon: 'attention-yellow'
        }
      }

      return {
        action: 'Просмотреть',
        link: (id: string) => `/assigned-works/${id}/read`,
        icon: 'check-green'
      }
    }

    // role is student
    if (assignedWork.solveStatus === 'not-started') {
      return {
        action: 'Начать выполнение',
        link: (id: string) => `/assigned-works/${id}/solve`,
        icon: 'cross-red'
      }
    }

    if (assignedWork.solveStatus === 'in-progress') {
      return {
        action: 'Продолжить выполнение',
        link: (id: string) => `/assigned-works/${id}/solve`,
        icon: 'cross-red'
      }
    }

    return {
      action: 'Просмотреть',
      link: (id: string) => `/assigned-works/${id}/read`,
      icon: 'check-green'
    }
  }

  function getTask(taskId: string) {
    return assignedWork.value?.work?.tasks.find((task) => task.id === taskId)
  }

  function getTaskBySlug(taskSlug: string) {
    return assignedWork.value?.work?.tasks.find(
      (task) => task.slug === taskSlug
    )
  }

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

  function submitWork() {
    const tasks = assignedWork.value!.work?.tasks || []

    if (mode.value === 'solve' && !tasks.every((task) => taskHasAnswer(task))) {
      sureSubmitModalError.value = 'Вы не ответили на все вопросы'
    } else {
      sureSubmitModalError.value = ''
    }

    if (!sureSubmitModalVisible.value) {
      sureSubmitModalVisible.value = true
      return
    }

    _globalStore.setLoading(true)

    http
      .patch(
        `/assigned-work/${assignedWork.value!.id}/${mode.value}`,
        assignedWork.value
      )
      .then(() => {
        _globalStore.setLoading(false)
        _router.push(`/assigned-works/${works[0].id}/${mode}/success?m=done`)
      })
      .catch(() => {
        _globalStore.setLoading(false)
        _globalStore.openModal('error', 'Не удалось отправить работу')
      })
  }

  function shiftDeadline() {
    console.log(1)
    if (mode.value === 'read') return

    if (!shiftDeadlineModalVisible.value) {
      console.log(1.5)
      shiftDeadlineModalVisible.value = true
      return
    }

    console.log(2)
    _globalStore.setLoading(true)
    http
      .patch(`/assigned-work/${assignedWork.value!.id}/shift-deadline`)
      .then(() => {
        _globalStore.openModal('success', 'Дедлайн сдвинут!')
      })
      .catch(() =>
        _globalStore.openModal('error', 'Не удалось сдвинуть дедлайн')
      )
      .finally(() => _globalStore.setLoading(false))
  }

  return {
    works,
    search,
    assignedWorkId,
    assignedWork,
    taskSlug,
    taskId,
    task,
    sureSubmitModalVisible,
    sureSubmitModalError,
    shiftDeadlineModalVisible,
    shiftDeadline,
    getUserAction,
    getTask,
    taskHasAnswer,
    submitWork,
    mode,
    fieldVisibility,
    baseUrl,
    nextTaskLink
  }
})
