import { useGlobalStore } from '@/store'
import type { AssignedWork } from '@/types/entities/AssignedWork'
import { type Course } from '@/types/entities/Course'
import type { Material } from '@/types/entities/Material'
import { http } from '@/utils/http'
import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

export const useMaterialsStore = defineStore('materials', () => {
  const _globalStore = useGlobalStore()
  const _route = useRoute()

  const courses = ref<Course[]>([])
  const course = ref<Course>()
  const search = ref('')

  const assignedWorkLink = ref('')

  const material = computed<Material | undefined>(() => {
    if (!_route.params.slug) return undefined

    return getMaterialBySlug(_route.params.slug as string)
  })

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

  watch(
    [search, () => _route.path],
    () => {
      if (_route.params.courseSlug) return

      http
        .get('/course', { search: search.value })
        .then((response) => {
          courses.value = response
        })
        .catch(() => {
          _globalStore.openModal('error', 'Ошибка при загрузке данных')
        })
    },
    { immediate: true }
  )

  watch(
    () => _route.params.courseSlug,
    () => {
      if (!_route.params.courseSlug) return

      _globalStore.setLoading(true)
      http
        .get(`/course/${_route.params.courseSlug}`)
        .then((data: Course) => {
          for (const chapter of data.chapters || []) {
            chapter.materials = (chapter.materials || []).sort(
              (a, b) => a.order - b.order
            )
          }
          course.value = data
        })
        .catch(() => {
          _globalStore.openModal('error', 'Произошла ошибка при загрузке курса')
        })
        .finally(() => {
          _globalStore.setLoading(false)
        })
    },
    { immediate: true }
  )

  watch(
    () => _route.params.slug,
    () => {
      if (!_route.params.slug) return
      if (_globalStore._userRole !== 'student') return

      http
        .get(`/course/material/${_route.params.slug}/assigned-work`)
        .then((data) => {
          if (!data) return

          const assignedWork = data as AssignedWork

          switch (assignedWork.solveStatus) {
            case 'not-started':
            case 'in-progress':
              return (assignedWorkLink.value = `/assigned-works/${assignedWork.id}/solve`)
            case 'made-in-deadline':
            case 'made-after-deadline':
            default:
              return (assignedWorkLink.value = `/assigned-works/${assignedWork.id}/read`)
          }
        })
        .catch(() => {
          _globalStore.openModal(
            'error',
            'Произошла ошибка при загрузке прикрепленной работы'
          )
        })
    },
    { immediate: true }
  )

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
