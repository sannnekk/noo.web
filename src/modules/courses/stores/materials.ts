import { Core } from '@/core/Core'
import type { AssignedWork } from '@/core/data/entities/AssignedWork'
import { type Course } from '@/core/data/entities/Course'
import type { Material } from '@/core/data/entities/Material'
import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

export const useMaterialsStore = defineStore('materials', () => {
  const courseService = Core.Services.Course
  const uiService = Core.Services.UI
  const _route = useRoute()

  /**
   * All the courses
   */
  const courses = ref<Course[]>([])

  /**
   * The current course
   */
  const course = ref<Course | null>(null)

  /**
   * The search query
   */
  const search = ref('')

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
   * Watch the search query and the route to load the courses
   */
  watch(
    [search, () => _route.path],
    async () => {
      if (_route.params.courseSlug) return
      if (_route.path === '/courses') return

      try {
        const response = await courseService.getCourses({
          search: search.value
        })
        courses.value = response.data
      } catch (error) {
        uiService.openErrorModal('Произошла ошибка при загрузке курсов')
      }
    },
    { immediate: true }
  )

  /**
   * Watch the course slug to load the course
   */
  watch(
    () => _route.params.courseSlug,
    async () => {
      if (!_route.params.courseSlug) return

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
    },
    { immediate: true }
  )

  /**
   * Watch the material slug to load the assigned work
   */
  watch(
    () => _route.params.slug,
    async () => {
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
        uiService.openErrorModal('Произошла ошибка при загрузке работы')
      } finally {
        uiService.setLoading(false)
      }
    },
    { immediate: true }
  )

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
    courses,
    course,
    search,
    materialsTree,
    getMaterialBySlug,
    assignedWorkLink,
    material
  }
})
