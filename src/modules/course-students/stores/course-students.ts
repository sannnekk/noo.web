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
    const uiService = Core.Services.UI
    const route = useRoute()

    const courseSlug = computed(() => route.params.courseSlug as string)
    const course = ref<Course | null>(null)

    const studentSearch = useSearch(fetchStudents)

    async function fetchCourse() {
      try {
        const response = await courseService.getCourse(courseSlug.value, {
          showLoader: true
        })

        course.value = response.data
        studentSearch.trigger()
      } catch (error: any) {
        uiService.openErrorModal('', error.message)
      }
    }

    async function fetchStudents(pagination: Pagination) {
      if (
        Core.Context.roleIs(['student', 'mentor', 'assistant']) ||
        !course.value
      ) {
        return
      }

      try {
        return await courseService.getStudentListWithAssignments(
          course.value.id,
          pagination
        )
      } catch (error: any) {
        uiService.openErrorModal(
          'Произошла ошибка при загрузке студентов',
          error.message
        )
      }
    }

    async function addStudent(user: User): Promise<true | string> {
      if (!course.value) {
        return 'Курс не найден'
      }

      try {
        await courseService.addStudentsToCourse(courseSlug.value, [user.id])

        course.value.studentCount = (course.value.studentCount || 0) + 1

        if (!user.courseAssignments?.length) {
          user.courseAssignments = []
        }

        user.courseAssignments = [
          entityFactory<CourseAssignment>('course-assignment')
        ]

        return true
      } catch (error: any) {
        return error.message
      }
    }

    async function removeStudent(user: User): Promise<true | string> {
      if (!course.value) {
        return 'Курс не найден'
      }

      try {
        await courseService.removeStudentsFromCourse(courseSlug.value, [
          user.id
        ])

        user.courseAssignments = []

        course.value.studentCount =
          (course.value.studentCount || 0) > 0
            ? (course.value.studentCount || 0) - 1
            : 0

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
