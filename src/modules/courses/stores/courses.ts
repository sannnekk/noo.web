import { useSearch } from '@/composables/useSearch'
import { Core } from '@/core/Core'
import type { Pagination } from '@/core/data/Pagination'
import type { Course } from '@/core/data/entities/Course'
import type { CourseAssignment } from '@/core/data/entities/CourseAssignment'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useCoursesStore = defineStore('courses-module:courses', () => {
  const courseService = Core.Services.Course
  const uiService = Core.Services.UI

  /**
   * search
   */
  const {
    pagination,
    results,
    resultsMeta,
    isListLoading,
    trigger: triggerSearch
  } = useSearch<Course>(fetchCourses, {
    initialPagination: {
      limit: 9
    },
    immediate: true
  })

  /**
   * Current tab index for student view
   */
  const currentTabIndex = ref(0)

  /**
   * Fetch the courses
   */
  async function fetchCourses(pagination: Pagination) {
    if (Core.Context.roleIs(['student'])) {
      return
    }

    try {
      return await courseService.getCourses(pagination)
    } catch (error: any) {
      uiService.openErrorModal(
        'Произошла ошибка при загрузке курсов',
        error.message
      )
    }
  }

  /**
   * Fetch the course assignments
   */
  async function fetchAssignments(pagination: Pagination) {
    if (Core.Context.roleIs(['admin', 'teacher', 'mentor'])) {
      return
    }

    try {
      return await courseService.getStudentCourses(
        Core.Context.User!.id,
        pagination
      )
    } catch (error: any) {
      uiService.openErrorModal(
        'Произошла ошибка при загрузке заданий',
        error.message
      )
    }
  }

  /**
   * Archive course assignment
   */
  async function archiveAssignment(assignment: CourseAssignment) {
    try {
      await courseService.archiveAssignment(assignment.id, { showLoader: true })
      uiService.openSuccessModal('Курс успешно архивирован')
    } catch (error: any) {
      uiService.openErrorModal(
        'Произошла ошибка при архивировании курса',
        error.message
      )
    }
  }

  /**
   * Unarchive course assignment
   */
  async function unarchiveAssignment(assignment: CourseAssignment) {
    try {
      await courseService.unarchiveAssignment(assignment.id, {
        showLoader: true
      })
      uiService.openSuccessModal('Курс успешно восстановлен')
    } catch (error: any) {
      uiService.openErrorModal(
        'Произошла ошибка при восстановлении курса',
        error.message
      )
    }
  }

  return {
    pagination,
    results,
    resultsMeta,
    isListLoading,
    triggerSearch,
    currentTabIndex,
    fetchAssignments,
    archiveAssignment,
    unarchiveAssignment
  }
})
