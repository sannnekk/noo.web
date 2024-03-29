import { useSearch } from '@/composables/useSearch'
import { Core } from '@/core/Core'
import type { Pagination } from '@/core/data/Pagination'
import type { Course } from '@/core/data/entities/Course'
import { defineStore } from 'pinia'

export const useCoursesStore = defineStore('courses-module:courses', () => {
  const courseService = Core.Services.Course
  const uiService = Core.Services.UI

  /**
   * search
   */
  const { pagination, results, resultsMeta, isListLoading } =
    useSearch<Course>(fetchCourses)

  /**
   * Fetch the courses
   */
  async function fetchCourses(pagination: Pagination) {
    try {
      return await courseService.getCourses(pagination)
    } catch (error) {
      uiService.openErrorModal('Произошла ошибка при загрузке курсов')
    }
  }

  return {
    pagination,
    results,
    resultsMeta,
    isListLoading
  }
})
