import { useSearch } from '@/composables/useSearch'
import { Core } from '@/core/Core'
import type { Pagination } from '@/core/data/Pagination'
import type { Course } from '@/core/data/entities/Course'
import type { User } from '@/core/data/entities/User'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'

export const useCourseStudentsStore = defineStore(
  'course-students-module:course-students',
  () => {
    const courseService = Core.Services.Course
    const userService = Core.Services.User
    const uiService = Core.Services.UI
    const route = useRoute()

    const courseSlug = computed(() => route.params.courseSlug as string)
    const course = ref<Course | null>(null)

    const studentSearch = useSearch(fetchStudents, {
      immediate: true
    })

    async function fetchCourse() {
      uiService.setLoading(true)

      try {
        const response = await courseService.getCourse(courseSlug.value)

        course.value = response.data
      } catch (error: any) {
        uiService.openErrorModal('', error.message)
      } finally {
        uiService.setLoading(false)
      }
    }

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

    async function addStudent(id: User['id']): Promise<true | string> {
      if (!course.value) {
        return 'Курс не найден'
      }

      try {
        await courseService.addStudentsToCourse(courseSlug.value, [id])

        if (!course.value.studentIds) {
          course.value.studentIds = []
        }

        course.value.studentIds.push(id)

        return true
      } catch (error: any) {
        return error.message
      }
    }

    async function removeStudent(id: User['id']): Promise<true | string> {
      if (!course.value) {
        return 'Курс не найден'
      }

      try {
        await courseService.removeStudentsFromCourse(courseSlug.value, [id])

        if (!course.value.studentIds) {
          return true
        }

        const index = course.value.studentIds.indexOf(id)

        if (index !== -1) {
          course.value.studentIds.splice(index, 1)
        }

        return true
      } catch (error: any) {
        return error.message
      }
    }

    return {
      studentSearch,
      course,
      fetchCourse,
      addStudent,
      removeStudent
    }
  }
)
