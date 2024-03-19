import { Core } from '@/core/Core'
import { defineStore } from 'pinia'
import { type Course } from '@/core/data/entities/Course'
import type { Material } from '@/core/data/entities/Material'
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'

export const useCourseStore = defineStore('courses-module:course', () => {
  const courseService = Core.Services.Course
  const uiService = Core.Services.UI

  const _route = useRoute()

  /**
   * The current course
   */
  const course = ref<Course | null>(null)

  if (course.value === null) {
    fetchCourse()
  }

  /**
   * The link to the assigned work
   */
  const assignedWorkLink = ref('')

  /**
   * I don't see works
   */
  const iDontSeeWorks = ref(false)

  /**
   * The current material
   */
  const material = computed<Material | undefined>(() => {
    if (!_route.params.slug) return undefined

    return getMaterialBySlug(_route.params.slug as string)
  })

  /**
   * The materials tree
   */
  const materialsTree = computed(() => {
    if (!course || !course.value?.chapters) return []

    return course.value.chapters.map((chapter) => {
      return {
        ...chapter,
        materials: undefined,
        children: chapter.materials
      }
    })
  })

  /**
   * Fetch the course by its slug
   */
  async function fetchCourse() {
    uiService.setLoading(true)

    try {
      const response = await courseService.getCourse(
        _route.params.courseSlug as string
      )
      course.value = response.data
    } catch (error: any) {
      uiService.openErrorModal('Произошла ошибка при загрузке курса')
    } finally {
      uiService.setLoading(false)
    }
  }

  /**
   * Fetch assigned work to material
   */
  async function fetchAssignedWorkToMaterial() {
    if (!_route.params.slug) return
    if (Core.Context.User?.role !== 'student') return

    try {
      const response = await courseService.getAssignedWorkToMaterial(
        _route.params.slug as string
      )

      const assignedWork = response.data

      if (!assignedWork) return

      switch (assignedWork.solveStatus) {
        case 'not-started':
        case 'in-progress':
          return (assignedWorkLink.value = `/assigned-works/${assignedWork.id}/solve`)
        case 'made-in-deadline':
        case 'made-after-deadline':
        default:
          return (assignedWorkLink.value = `/assigned-works/${assignedWork.id}/read`)
      }
    } catch (error: any) {
      uiService.openErrorModal(
        'Произошла ошибка при загрузке работы',
        error.message
      )
    } finally {
      uiService.setLoading(false)
    }
  }

  /**
   * Get the material by its slug
   */
  function getMaterialBySlug(slug: string): Material | undefined {
    if (!course || !course.value?.chapters) return undefined

    const materials = course.value.chapters.flatMap(
      (chapter) => chapter!.materials
    )

    return materials.find((material) => material?.slug === slug)
  }

  /**
   * Assign me works
   */
  async function assignMeWorks() {
    if (!course.value) {
      uiService.openErrorModal(
        'Не удалось запросить доступ к работам',
        'Не удалось получить информацию о курсе. Возможно, курс был удален. Попробуйте обновить страницу.'
      )
      return
    }

    if (Core.Context.User?.role !== 'student') {
      uiService.openErrorModal(
        'Не удалось запросить доступ к работам',
        'Только студенты могут запрашивать доступ к работам'
      )
      return
    }

    uiService.setLoading(true)

    try {
      await courseService.assignMeWorks(course.value.slug)
      iDontSeeWorks.value = false
      uiService.openSuccessModal(
        'Работа успешно назначена',
        'Теперь у вас есть доступ к работам. Перезагрузите страницу, чтобы увидеть изменения'
      )
    } catch (error: any) {
      uiService.openErrorModal(
        'Произошла ошибка при запросе доступа к работам',
        error.message
      )
    } finally {
      uiService.setLoading(false)
    }
  }

  return {
    course,
    material,
    materialsTree,
    assignedWorkLink,
    assignMeWorks,
    fetchCourse,
    fetchAssignedWorkToMaterial,
    getMaterialBySlug,
    iDontSeeWorks
  }
})
