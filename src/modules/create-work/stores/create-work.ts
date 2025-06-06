import type { Task } from '@/core/data/entities/Task'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { Work } from '@/core/data/entities/Work'
import { Core } from '@/core/Core'
import { useWorksStore } from '@/modules/works/stores/works'
import { entityFactory } from '@/core/utils/entityFactory'

export const useCreateWorkStore = defineStore(
  'create-work-module:create-work',
  () => {
    const workService = Core.Services.Work
    const uiService = Core.Services.UI
    const _router = useRouter()
    const _route = useRoute()

    const worksStore = useWorksStore()

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
        checkHint: '',
        subject: null
      } as any as Work)

    /**
     * Current work
     */
    const work = ref<
      Omit<Work, 'createdAt' | 'updatedAt' | 'slug' | 'taskIds'> & {
        tasks: Omit<Task, 'id'>[]
      }
    >(emptyWork())

    /**
     * Base url for this work
     */
    const workBaseUrl = computed(() => {
      if (_route.params.taskSlug) {
        return _route.path.split('/').slice(0, -1).join('/')
      }

      return _route.path
    })

    /**
     * Load work if work slug is present in the route
     */
    async function fetchWork() {
      if (!_route.params.workSlug) {
        work.value = emptyWork()
        return
      }

      try {
        const response = await workService.getWork(
          _route.params.workSlug as string,
          { showLoader: true }
        )

        if (!response.data) {
          uiService.openErrorModal('Работа не найдена')
          return
        }

        work.value = response.data
      } catch (error: any) {
        work.value = emptyWork()
        uiService.openErrorModal('Произошла ошибка при загрузке работы')
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
      work.value.tasks.push({
        ...entityFactory<Task>('task'),
        order: work.value.tasks.length + 1
      })
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
     * Navigate to the next task
     */
    function toNextTask() {
      if (!work.value) {
        return
      }

      const currentTaskSlug = _route.params.taskSlug
      const currentTaskIndex = work.value.tasks.findIndex(
        (task) => task.slug === currentTaskSlug
      )
      const nextTaskSlug = work.value.tasks.at(currentTaskIndex + 1)?.slug

      if (!nextTaskSlug) {
        return
      }

      const link = `${workBaseUrl.value}/${nextTaskSlug}`

      _router.push(link)
    }

    /**
     * Navigate to the previous task
     */
    function toPrevTask() {
      if (!work.value) {
        return
      }

      const currentTaskSlug = _route.params.taskSlug
      const currentTaskIndex = work.value.tasks.findIndex(
        (task) => task.slug === currentTaskSlug
      )
      const prevTaskSlug = work.value.tasks.at(currentTaskIndex - 1)?.slug

      if (!prevTaskSlug) {
        return
      }

      const link = `${workBaseUrl.value}/${prevTaskSlug}`

      _router.push(link)
    }

    /**
     * Show general info
     */
    function showGeneralInfo() {
      _router.push(`${workBaseUrl.value}/general-info`)
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

      if (!payload.subject) {
        uiService.openWarningModal('У работы должен быть предмет')
        return
      }

      // add order to tasks
      payload.tasks = payload.tasks.map((task, index) => {
        return {
          ...task,
          order: index + 1
        }
      })

      if (_route.params.workSlug && _route.params.workSlug.length) {
        try {
          await workService.updateWork(work.value.id, payload as Work, {
            showLoader: true
          })
          uiService.openSuccessModal('Работа успешно обновлена', undefined, [
            {
              label: 'Вернуться к списку работ',
              design: 'primary',
              handler: () => {
                worksStore.triggerSearch()
                _router.push('/works')
              }
            }
          ])
        } catch (error: any) {
          uiService.openErrorModal(
            'Произошла ошибка при обновлении работы',
            error.message
          )
        }
      } else {
        try {
          const createdWorkResponse = await workService.createWork(
            payload as Work,
            {
              showLoader: true
            }
          )

          uiService.openSuccessModal('Работа успешно создана', undefined, [
            {
              label: 'Вернуться к списку работ',
              design: 'primary',
              handler: () => {
                worksStore.triggerSearch()
                _router.push('/works')
              }
            }
          ])

          if (createdWorkResponse.data) {
            _router.push(`/create-work${createdWorkResponse.data.slug}`)
          }
        } catch (error: any) {
          uiService.openErrorModal(
            'Произошла ошибка при создании работы',
            error.message
          )
        }
      }
    }

    return {
      work,
      addTask,
      removeTask,
      getTask,
      submitWork,
      fetchWork,
      toNextTask,
      toPrevTask,
      showGeneralInfo
    }
  }
)
