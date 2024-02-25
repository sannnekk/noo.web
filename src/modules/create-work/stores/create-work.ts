import type { Task } from '@/core/data/entities/Task'
import { defineStore } from 'pinia'
import { computed, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { v4 as uuid } from 'uuid'
import type { Work } from '@/core/data/entities/Work'
import { Core } from '@/core/Core'

export const useCreateWorkStore = defineStore('create-work', () => {
  const workService = Core.Services.Work
  const uiService = Core.Services.UI
  const _router = useRouter()
  const _route = useRoute()

  /**
   * Current work
   */
  const work = ref<
    Omit<Work, 'createdAt' | 'updatedAt' | 'slug' | 'taskIds'> & {
      tasks: Omit<Task, 'id'>[]
    }
  >({
    name: '',
    description: '',
    tasks: []
  } as any)

  /**
   * Load work if work slug is present in the route
   */
  watch(
    () => _route.params.workSlug,
    async () => {
      if (!_route.params.workSlug || !_route.params.workSlug.length) return

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
        uiService.openErrorModal('Произошла ошибка при загрузке работы')
      } finally {
        uiService.setLoading(false)
      }
    },
    { immediate: true }
  )

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
      type: 'one_choice',
      createdAt: new Date(),
      updatedAt: new Date(),
      workId: ''
    }
  }

  /**
   * Task as an object
   */
  const taskMap = computed({
    get() {
      return work.value.tasks.reduce((acc, task) => {
        acc[task.slug] = task
        return acc
      }, {} as Record<string, Task>)
    },
    set(value) {
      work.value.tasks.splice(
        0,
        work.value.tasks.length,
        ...Object.values(value)
      )
    }
  })

  /**
   * New task to add
   */
  const taskToAdd = ref<Omit<Task, 'id'>>(_emptyTask())

  /**
   * Add new task to the work
   */
  function addTask() {
    work.value.tasks.push(taskToAdd.value)
    taskToAdd.value = _emptyTask()
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

    // Remove ids from tasks and options
    payload.tasks.forEach((task, index) => {
      payload.tasks[index]!.optionsIds = undefined
      payload.tasks[index]!.options = task.options?.map((option) => {
        return {
          ...option,
          id: undefined as any
        }
      })
    })

    // add order to tasks
    payload.tasks = payload.tasks.map((task, index) => {
      return {
        ...task,
        order: index + 1
      }
    })

    if (_route.params.workSlug && _route.params.workSlug.length) {
      try {
        await workService.updateWork(
          _route.params.workSlug as string,
          payload as Work
        )
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

  return { work, taskToAdd, addTask, taskMap, submitWork }
})
