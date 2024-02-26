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

  /**
   * The link to the assigned work
   */
  const assignedWorkLink = ref('')

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
    if (!['student', 'mentor'].includes(Core.Context.User?.role!)) return

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
      uiService.openErrorModal('Произошла ошибка при загрузке работы')
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

  return {
    course,
    material,
    materialsTree,
    assignedWorkLink,
    fetchCourse,
    fetchAssignedWorkToMaterial,
    getMaterialBySlug
  }
})
