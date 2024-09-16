import { useSearch } from '@/composables/useSearch'
import { Core } from '@/core/Core'
import type { Pagination } from '@/core/data/Pagination'
import type { Course } from '@/core/data/entities/Course'
import type { CourseAssignment } from '@/core/data/entities/CourseAssignment'
import type { User } from '@/core/data/entities/User'
import { entityFactory } from '@/core/utils/entityFactory'
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
      try {
        const response = await courseService.getCourse(courseSlug.value, {
          showLoader: true
        })

        course.value = response.data
      } catch (error: any) {
        uiService.openErrorModal('', error.message)
      }
    }

    async function fetchStudents(pagination: Pagination) {
      if (Core.Context.roleIs(['admin', 'student', 'mentor'])) {
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

        if (!course.value.studentAssignments) {
          course.value.studentAssignments = []
        }

        const assignment = entityFactory<CourseAssignment>('course-assignment')
        assignment.studentId = id
        assignment.assignerId = Core.Context.User!.id
        assignment.courseId = course.value.id

        course.value.studentAssignments.push(assignment)

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

        if (!course.value.studentAssignments) {
          return true
        }

        const index = course.value.studentAssignments.findIndex(
          (assignment) => assignment.studentId === id
        )

        if (index !== -1) {
          course.value.studentAssignments.splice(index, 1)
        }

        return true
      } catch (error: any) {
        return error.message
      }
    }

    async function syncStudentsViaEmail(emails: string[]): Promise<void> {
      try {
        if (!course.value) {
          throw new Error('Курс не найден')
        }

        await courseService.addStudentsViaEmail(courseSlug.value, emails, {
          showLoader: true
        })

        await fetchCourse()
        await studentSearch.trigger()

        uiService.openSuccessModal('Ученики успешно добавлены через имейлы')
      } catch (error: any) {
        uiService.openErrorModal(
          'Произошла ошибка при синзронизации учеников через имейлы',
          error.message
        )
      }
    }

    async function removeStudentsViaEmail(emails: string[]): Promise<void> {
      try {
        if (!course.value) {
          throw new Error('Курс не найден')
        }

        await courseService.removeStudentsViaEmail(courseSlug.value, emails, {
          showLoader: true
        })

        await fetchCourse()
        await studentSearch.trigger()

        uiService.openSuccessModal('Ученики успешно удалены через имейлы')
      } catch (error: any) {
        uiService.openErrorModal(
          'Произошла ошибка при удалении учеников через имейлы',
          error.message
        )
      }
    }

    return {
      studentSearch,
      course,
      fetchCourse,
      addStudent,
      removeStudent,
      syncStudentsViaEmail,
      removeStudentsViaEmail
    }
  }
)
