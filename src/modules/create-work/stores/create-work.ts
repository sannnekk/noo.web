import type { Task } from '@/core/data/entities/Task'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { v4 as uuid } from 'uuid'
import type { Work } from '@/core/data/entities/Work'
import { Core } from '@/core/Core'

export const useCreateWorkStore = defineStore(
  'create-work-module:create-work',
  () => {
    const workService = Core.Services.Work
    const uiService = Core.Services.UI
    const _router = useRouter()
    const _route = useRoute()

    /**
     * Work types
     */
    const workTypeOptions = [
      {
        value: 'trial-work',
        label: 'Пробник'
      },
      {
        value: 'mini-test',
        label: 'Мини-зачет'
      },
      {
        value: 'test',
        label: 'Тест'
      },
      {
        value: 'second-part',
        label: 'Вторая часть'
      },
      {
        value: 'phrase',
        label: 'Фраза'
      }
    ]

    /**
     * Empty work
     */
    const emptyWork = () =>
      ({
        name: '',
        description: '',
        tasks: [],
        type: 'trial-work',
        solveHint: '',
        checkHint: ''
      } as unknown as Work)

    /**
     * Current work
     */
    const work = ref<
      Omit<Work, 'createdAt' | 'updatedAt' | 'slug' | 'taskIds'> & {
        tasks: Omit<Task, 'id'>[]
      }
    >(emptyWork())

    /**
     * Load work if work slug is present in the route
     */
    async function fetchWork() {
      if (!_route.params.workSlug) {
        work.value = emptyWork()
        return
      }

      uiService.setLoading(true)

      try {
        const response = await workService.getWork(
          _route.params.workSlug as string
        )

        if (!response.data) {
          uiService.openErrorModal('Работа не найдена')
          return
        }

        work.value = response.data
      } catch (error: any) {
        work.value = emptyWork()
        uiService.openErrorModal('Произошла ошибка при загрузке работы')
      } finally {
        uiService.setLoading(false)
      }
    }

    /**
     * Get mpty task
     */
    function _emptyTask(): Omit<Task, 'id'> {
      return {
        order: work.value.tasks.length + 1,
        content: {
          ops: [
            {
              insert: '\n'
            }
          ]
        },
        slug: uuid(),
        highestScore: 1,
        type: 'word',
        solveHint: {
          ops: [
            {
              insert: '\n'
            }
          ]
        },
        checkHint: {
          ops: [
            {
              insert: '\n'
            }
          ]
        },
        checkingStrategy: 'type1',
        rightAnswer: '',
        createdAt: new Date(),
        updatedAt: new Date(),
        workId: ''
      }
    }

    /**
     * Task as an object
     */
    function getTask(taskSlug: Task['slug']) {
      return work.value.tasks.find((task) => task.slug === taskSlug)
    }

    /**
     * Add new task to the work
     */
    function addTask() {
      work.value.tasks.push(_emptyTask())
    }

    /**
     * Remove task from the work
     */
    function removeTask(taskSlug: Task['slug']) {
      work.value.tasks = work.value.tasks.filter(
        (task) => task.slug !== taskSlug
      )
    }

    /**
     * Save work
     */
    async function submitWork() {
      const payload = work.value

      if (!payload.name.trim()) {
        uiService.openWarningModal('У работы должно быть название')
        return
      }

      if (!payload.tasks.length) {
        uiService.openWarningModal('У работы должны быть задания')
        return
      }

      uiService.setLoading(true)

      // add order to tasks
      payload.tasks = payload.tasks.map((task, index) => {
        return {
          ...task,
          order: index + 1
        }
      })

      if (_route.params.workSlug && _route.params.workSlug.length) {
        try {
          await workService.updateWork(work.value.id, payload as Work)
          _router.push('/create-work/success')
        } catch (error: any) {
          uiService.openErrorModal(
            'Произошла ошибка при обновлении работы',
            error.message
          )
        } finally {
          uiService.setLoading(false)
        }
      } else {
        try {
          await workService.createWork(payload as Work)
          _router.push('/create-work/success')
        } catch (error: any) {
          uiService.openErrorModal(
            'Произошла ошибка при создании работы',
            error.message
          )
        } finally {
          uiService.setLoading(false)
        }
      }
    }

    /**
     * Checking strategy options
     */
    const checkingStrategyOptions = [
      {
        label: '1 символ неверный: 0 б.',
        value: 'type1'
      },
      {
        label: '1 символ неверный: -1 б.',
        value: 'type2'
      },
      {
        label: '1 символ неверный, включая лишний/недостающий: -1 б.',
        value: 'type3'
      },
      {
        label: 'Последовательность',
        value: 'type4'
      }
    ]

    return {
      work,
      addTask,
      removeTask,
      getTask,
      submitWork,
      fetchWork,
      workTypeOptions,
      checkingStrategyOptions
    }
  }
)
