import type { Task } from '@/types/entities/Task'
import { defineStore } from 'pinia'
import { computed, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { v4 as uuid } from 'uuid'
import type { Work } from '@/types/entities/Work'

export const useCreateWorkStore = defineStore('create-work', () => {
  const _router = useRouter()

  const work = reactive<Omit<Work, 'id' | 'createdAt' | 'updatedAt' | 'slug'>>({
    name: '',
    description: '',
    tasks: [
      {
        id: '1',
        name: 'Первый вопрос',
        content: `{
          "ops": [
            {
              "insert": "\n"
            }
          ]
        }`,
        slug: 'task-1',
        highestScore: 3,
        type: 'one_choice',
        createdAt: new Date(),
        updatedAt: new Date(),
        workId: '1'
      },
      {
        id: '2',
        name: 'Второй вопрос',
        content: `{
          "ops": [
            {
              "insert": "\n"
            }
          ]
        }`,
        slug: 'task-2',
        highestScore: 3,
        type: 'multiple_choice',
        createdAt: new Date(),
        updatedAt: new Date(),
        workId: '1'
      },
      {
        id: '3',
        name: 'Третий вопрос',
        content: `{
          "ops": [
            {
              "insert": "\n"
            }
          ]
        }`,
        slug: 'task-3',
        highestScore: 3,
        type: 'word',
        createdAt: new Date(),
        updatedAt: new Date(),
        workId: '1'
      },
      {
        id: '4',
        name: 'Четвертый вопрос',
        content: `{
          "ops": [
            {
              "insert": "\n"
            }
          ]
        }`,
        slug: 'task-4',
        highestScore: 3,
        type: 'text',
        createdAt: new Date(),
        updatedAt: new Date(),
        workId: '1'
      }
    ],
    taskIds: ['1', '2', '3', '4']
  })

  function _emptyTask(): Task {
    return {
      id: uuid(),
      name: '',
      content: `{
        "ops": [
          {
            "insert": "\n"
          }
        ]
      }`,
      slug: '',
      highestScore: 1,
      type: 'one_choice',
      createdAt: new Date(),
      updatedAt: new Date(),
      workId: ''
    }
  }

  const taskMap = computed({
    get() {
      return work.tasks.reduce((acc, task) => {
        acc[task.id] = task
        return acc
      }, {} as Record<string, Task>)
    },
    set(value) {
      work.tasks.splice(0, work.tasks.length, ...Object.values(value))
    }
  })

  const taskToAdd = ref<Task>(_emptyTask())

  function addTask() {
    work.tasks.push(taskToAdd.value)
    taskToAdd.value = _emptyTask()
  }

  function save() {}

  function submitWork() {
    _router.push('/create-work/success')
  }

  return { work, taskToAdd, addTask, taskMap, submitWork, save }
})
