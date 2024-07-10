import { Core } from '@/core/Core'
import { defineStore } from 'pinia'
import { type Course } from '@/core/data/entities/Course'
import type { Material } from '@/core/data/entities/Material'
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

export const useCourseStore = defineStore('courses-module:course', () => {
  const courseService = Core.Services.Course
  const assignedWorkService = Core.Services.AssignedWork
  const uiService = Core.Services.UI

  const _route = useRoute()
  const _router = useRouter()

  /**
   * The current course
   */
  const course = ref<Course | null>(null)

  if (course.value === null) {
    fetchCourse()
  }

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
    if (!course.value || !course.value?.chapters) return []

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
   * Get the material by its slug
   */
  function getMaterialBySlug(slug: string): Material | undefined {
    if (!course.value || !course.value?.chapters) return undefined

    const materials = course.value.chapters.flatMap(
      (chapter) => chapter!.materials
    )

    return materials.find((material) => material?.slug === slug)
  }

  /**
   * Assign me works
   */
  async function assignMeWork() {
    if (!course.value || !material.value) {
      uiService.openErrorModal(
        'Не удалось запросить доступ к работе',
        'Не удалось получить информацию о курсе. Возможно, курс был удален. Попробуйте обновить страницу.'
      )
      return
    }

    if (Core.Context.User?.role !== 'student') {
      uiService.openErrorModal(
        'Не удалось запросить доступ к работам',
        'Только студенты могут запрашивать доступ к работе'
      )
      return
    }

    uiService.setLoading(true)

    try {
      const response = await assignedWorkService.getOrCreateAssignedWork(
        material.value.slug
      )

      if (!response.data) {
        throw new Error('Не удалось получить информацию о работе')
      }

      _router.push(response.data.link)
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
    assignMeWork,
    fetchCourse,
    getMaterialBySlug
  }
})
