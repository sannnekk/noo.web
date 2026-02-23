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
   * All courses search
   */
  const allSearch = useSearch<Course>(fetchCourses, {
    initialPagination: {
      limit: 9
    },
    immediate: true
  })

  /**
   * Own courses search
   */
  const ownSearch = useSearch<Course>(fetchOwnCourses, {
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
   * Teacher tab index
   */
  const teacherTabIndex = ref(0)

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
   * Fetch the own courses
   */
  async function fetchOwnCourses(pagination: Pagination) {
    if (Core.Context.roleIs(['student', 'mentor', 'assistant'])) {
      return
    }

    try {
      return await courseService.getOwnCourses(pagination)
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
    if (Core.Context.roleIs(['admin', 'teacher', 'mentor', 'assistant'])) {
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

  /**
   * Pin course assignment
   */
  async function pinAssignment(assignment: CourseAssignment) {
    try {
      await courseService.pinAssignment(assignment.id, { showLoader: true })
    } catch (error: any) {
      uiService.openErrorModal(
        'Произошла ошибка при закреплении курса',
        error.message
      )
    }
  }

  /**
   * Unpin course assignment
   */
  async function unpinAssignment(assignment: CourseAssignment) {
    try {
      await courseService.unpinAssignment(assignment.id, { showLoader: true })
    } catch (error: any) {
      uiService.openErrorModal(
        'Произошла ошибка при откреплении курса',
        error.message
      )
    }
  }

  return {
    allSearch,
    ownSearch,
    currentTabIndex,
    teacherTabIndex,
    fetchAssignments,
    archiveAssignment,
    unarchiveAssignment,
    pinAssignment,
    unpinAssignment
  }
})
