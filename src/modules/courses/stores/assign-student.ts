import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import { useCourseStore } from './course'
import type { User } from '@/core/data/entities/User'
import { Core } from '@/core/Core'
import { useSearch } from '@/composables/useSearch'
import type { Pagination } from '@/core/data/Pagination'

export const useAssignStudentsStore = defineStore(
  'courses-module:assign-student',
  () => {
    const courseService = Core.Services.Course
    const userService = Core.Services.User
    const uiService = Core.Services.UI
    const courseStore = useCourseStore()

    /**
     * Search
     */
    const { pagination, results, resultsMeta, isListLoading } =
      useSearch<User>(fetchStudents)

    /**
     * Select student ids
     */
    const selectedStudentIds = ref(courseStore.course?.studentIds || [])

    /**
     * Students count
     */
    const studentsCount = computed(
      () => (courseStore.course?.studentIds || []).length
    )

    /**
     * Assign student modal visibility
     */
    const modalVisible = ref(false)

    /**
     * Watch for course change and update selected student ids
     */
    watch(
      () => courseStore.course,
      () => {
        selectedStudentIds.value = courseStore.course?.studentIds || []
      }
    )

    /**
     * Handle student selection
     */
    function onStudentSelected(userIds: User['id'][]) {
      selectedStudentIds.value = Array.from(new Set(userIds))
    }

    /**
     * Load students
     */
    async function fetchStudents(pagination: Pagination) {
      if (Core.Context.User?.role !== 'teacher') {
        return
      }

      try {
        return await userService.getStudents(pagination)
      } catch (error) {
        uiService.openErrorModal('Произошла ошибка при загрузке студентов')
      }
    }

    /**
     * Submit students to course
     */
    async function save() {
      if (Core.Context.User?.role !== 'teacher') {
        return
      }

      uiService.setLoading(true)

      try {
        await courseService.assignStudentsToCourse(
          courseStore.course!.slug,
          selectedStudentIds.value
        )

        uiService.openSuccessModal('Студенты успешно добавлены курс')
        modalVisible.value = false
      } catch (error: any) {
        uiService.openErrorModal(
          'Произошла ошибка при добавлении студентов к курсу',
          error.message
        )
      } finally {
        uiService.setLoading(false)
      }
    }

    return {
      pagination,
      results,
      resultsMeta,
      isListLoading,
      save,
      modalVisible,
      selectedStudentIds,
      studentsCount,
      onStudentSelected
    }
  }
)
