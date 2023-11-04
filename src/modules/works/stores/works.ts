import type { AssignedWork } from '@/types/entities/AssignedWork'
import { defineStore } from 'pinia'
import { ref, reactive, computed } from 'vue'
import { useGlobalStore } from '@/store'
import { useRoute, useRouter } from 'vue-router'
import type { Task } from '@/types/entities/Task'
import { isDeltaEmptyOrWhitespace } from '@/utils/deltaHelpers'

export type ActionType = 'read' | 'solve' | 'check'

export type UserAction = {
  action: string
  link: (id: string) => `/works/${typeof id}/${ActionType}`
  icon: string
}

export type Visibility = 'visible' | 'readonly' | 'hidden'

export type FieldVisibility = {
  solveBox: Visibility
  checkBox: Visibility
}

export const useWorksStore = defineStore('works', () => {
  const _globalStore = useGlobalStore()
  const _route = useRoute()
  const _router = useRouter()

  const mode = computed<ActionType>(() => _route.params.mode as ActionType)

  const sureSubmitModalVisible = ref(false)
  const sureSubmitModalError = ref('')

  const works = reactive<AssignedWork[]>([
    {
      id: '123132',
      slug: '123132',
      workId: '1',
      work: {
        id: '1',
        slug: '1',
        name: '01.03 ДЗ 2 часть, Биохимия клетки',
        description:
          'В этом задании вам предстоит решить задачи по биохимии клетки',
        tasks: [
          {
            id: '1',
            name: 'Первый вопрос',
            content: {
              ops: [
                {
                  insert:
                    'Какие факторы могут привести к разделению популяции и возникновению новых видов?\n'
                }
              ]
            },
            slug: '1',
            highestScore: 3,
            type: 'one_choice',
            options: [
              {
                id: 'o1',
                name: 'Первый вариант ответа',
                isCorrect: false,
                taskId: '1'
              },
              {
                id: 'o2',
                name: 'Второй вариант ответа',
                isCorrect: true,
                taskId: '1'
              }
            ],
            optionsIds: ['o1', 'o2'],
            createdAt: new Date(),
            updatedAt: new Date(),
            workId: '1'
          },
          {
            id: '2',
            name: 'Второй вопрос',
            content: {
              ops: [
                {
                  insert:
                    'Какой процесс отбора является основным механизмом эволюции?\n'
                }
              ]
            },
            slug: '2',
            highestScore: 3,
            type: 'multiple_choice',
            options: [
              {
                id: 'o1',
                name: 'Первый вариант ответа',
                isCorrect: false,
                taskId: '1'
              },
              {
                id: 'o2',
                name: 'Второй вариант ответа',
                isCorrect: true,
                taskId: '1'
              },
              {
                id: 'o3',
                name: 'Третий вариант ответа',
                isCorrect: true,
                taskId: '1'
              }
            ],
            optionsIds: ['o1', 'o2', 'o3'],
            createdAt: new Date(),
            updatedAt: new Date(),
            workId: '1'
          },
          {
            id: '3',
            name: 'Третий вопрос',
            content: {
              ops: [
                {
                  insert:
                    'Какие доказательства свидетельствуют о том, что все живые организмы имеют общего предка?\n'
                }
              ]
            },
            slug: '3',
            highestScore: 3,
            type: 'word',
            createdAt: new Date(),
            updatedAt: new Date(),
            workId: '1'
          },
          {
            id: '4',
            name: 'Четвертый вопрос',
            content: {
              ops: [
                {
                  insert:
                    'Какие адаптации могут развиваться в ответ на изменения в окружающей среде?\n'
                }
              ]
            },
            slug: '4',
            highestScore: 3,
            type: 'text',
            createdAt: new Date(),
            updatedAt: new Date(),
            workId: '1'
          }
        ],
        taskIds: ['1', '2', '3', '4']
      },
      solveDeadlineAt: new Date('2023-03-03'),
      checkDeadlineAt: new Date('2023-03-05'),
      solveStatus: 'made-in-deadline',
      checkStatus: 'checked-in-deadline',
      score: 13,
      maxScore: 20,
      mentors: [],
      mentorIds: [],
      answers: [],
      answerIds: [],
      comments: [],
      commentIds: [],
      studentId: '1',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ])

  const assignedWorkId = computed(() => _route.params.workId as string)
  const assignedWork = computed({
    get: () => getWork(assignedWorkId.value)!,
    set: (value) => setWork(value)
  })

  const taskId = computed(() => _route.params.taskId as string)
  const task = computed(() => getTask(assignedWorkId.value, taskId.value))

  const search = ref('')

  const fieldVisibility = computed<FieldVisibility>(() => {
    const role = _globalStore.getUserRole()!

    let solveBox: Visibility = 'hidden'
    let checkBox: Visibility = 'hidden'

    switch (role) {
      case 'student':
        solveBox = mode.value === 'solve' ? 'visible' : 'readonly'
        checkBox = mode.value === 'solve' ? 'hidden' : 'readonly'
        break
      case 'mentor':
        solveBox = 'readonly'
        checkBox = mode.value === 'check' ? 'visible' : 'readonly'
        break
      case 'admin':
      case 'teacher':
        solveBox = 'readonly'
        checkBox = 'readonly'
        break
    }

    return {
      solveBox,
      checkBox
    }
  })

  function getUserAction(assignedWork: AssignedWork): UserAction {
    const role = _globalStore.getUserRole()!

    if (role === 'admin' || role === 'teacher') {
      return {
        action: 'Просмотреть',
        link: (id: string) => `/works/${id}/read`,
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
          link: (id: string) => `/works/${id}/read`,
          icon: 'cross-red'
        }
      }

      if (assignedWork.checkStatus === 'not-checked') {
        return {
          action: 'Проверить',
          link: (id: string) => `/works/${id}/check`,
          icon: 'attention-yellow'
        }
      }

      if (assignedWork.checkStatus === 'in-progress') {
        return {
          action: 'Продолжить проверку',
          link: (id: string) => `/works/${id}/check`,
          icon: 'attention-yellow'
        }
      }

      return {
        action: 'Просмотреть',
        link: (id: string) => `/works/${id}/read`,
        icon: 'check-green'
      }
    }

    // role is student
    if (assignedWork.solveStatus === 'not-started') {
      return {
        action: 'Начать выполнение',
        link: (id: string) => `/works/${id}/solve`,
        icon: 'cross-red'
      }
    }

    if (assignedWork.solveStatus === 'in-progress') {
      return {
        action: 'Продолжить выполнение',
        link: (id: string) => `/works/${id}/solve`,
        icon: 'cross-red'
      }
    }

    return {
      action: 'Просмотреть',
      link: (id: string) => `/works/${id}/read`,
      icon: 'check-green'
    }
  }

  function getWork(workId: AssignedWork['id']): AssignedWork | undefined {
    return works.find((work) => work.id === workId)
  }

  function setWork(work: AssignedWork) {
    const index = works.findIndex((w) => w.id === work.id)

    if (index === -1) {
      works.push(work)
    } else {
      works[index] = work
    }
  }

  function getTask(workId: AssignedWork['id'], taskId: string) {
    const work = getWork(workId)

    if (!work) return undefined

    return work.work?.tasks.find((task) => task.id === taskId)
  }

  function taskHasAnswer(workId: AssignedWork['id'], task: Task): boolean {
    const work = getWork(workId)
    const answer = work?.answers.find((answer) => answer.taskId === task.id)

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
    const tasks = assignedWork.value.work?.tasks || []
    const answers = assignedWork.value.answers

    if (mode.value === 'solve' && tasks.length !== answers.length) {
      sureSubmitModalError.value = 'Вы не ответили на все вопросы'
    } else {
      sureSubmitModalError.value = ''
    }

    if (!sureSubmitModalVisible.value) {
      sureSubmitModalVisible.value = true
      return
    }

    console.log('submit work')
    _router.push(`/works/${works[0].id}/${mode}/success`)
  }

  return {
    works,
    search,
    assignedWorkId,
    assignedWork,
    taskId,
    task,
    sureSubmitModalVisible,
    sureSubmitModalError,
    getUserAction,
    getWork,
    setWork,
    getTask,
    taskHasAnswer,
    submitWork,
    mode,
    fieldVisibility
  }
})
