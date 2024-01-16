import type { Task } from '@/types/entities/Task'
import { defineStore } from 'pinia'
import { computed, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { v4 as uuid } from 'uuid'
import type { Work } from '@/types/entities/Work'
import { http } from '@/utils/http'
import { useGlobalStore } from '@/store'

export const useCreateWorkStore = defineStore('create-work', () => {
  const _router = useRouter()
  const _route = useRoute()
  const _globalStore = useGlobalStore()

  const work = ref<
    Omit<Work, 'createdAt' | 'updatedAt' | 'slug' | 'taskIds'> & {
      tasks: Omit<Task, 'id'>[]
    }
  >({
    name: '',
    description: '',
    tasks: []
  } as any)

  watch(
    () => _route.params.workSlug,
    () => {
      if (!_route.params.workSlug || !_route.params.workSlug.length) return

      _globalStore.setLoading(true)

      http
        .get(`/work/${_route.params.workSlug}`)
        .then((data) => (work.value = data))
        .catch(() => _globalStore.openModal('error', 'Не удалось найти работу'))
        .finally(() => _globalStore.setLoading(false))
    },
    { immediate: true }
  )

  function _emptyTask(): Omit<Task, 'id'> {
    return {
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

  const taskToAdd = ref<Omit<Task, 'id'>>(_emptyTask())

  function addTask() {
    work.value.tasks.push(taskToAdd.value)
    taskToAdd.value = _emptyTask()
  }

  async function submitWork() {
    _globalStore.setLoading(true)

    const payload = work.value

    payload.tasks.forEach((task, index) => {
      payload.tasks[index]!.optionsIds = undefined
      payload.tasks[index]!.options = task.options?.map((option) => {
        return {
          ...option,
          id: undefined as any
        }
      })
    })

    if (_route.params.workSlug && _route.params.workSlug.length) {
      await http
        .patch(`/work/${work.value.id}`, payload)
        .then(() => {
          _router.push(`/create-work${_route.params.workSlug}/success`)
        })
        .catch(() =>
          _globalStore.openModal('error', 'Не удалось обновить работу')
        )
        .finally(() => {
          _globalStore.setLoading(false)
        })
    } else {
      await http
        .post('/work', payload)
        .then(() => {
          _router.push('/create-work/success')
        })
        .catch(() => {
          _globalStore.openModal('error', 'Не удалось создать работу')
        })
        .finally(() => {
          _globalStore.setLoading(false)
        })
    }
  }

  return { work, taskToAdd, addTask, taskMap, submitWork }
})
