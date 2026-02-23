import { defineStore } from 'pinia'
import type { User } from '@/core/data/entities/User'
import { Core } from '@/core/Core'
import type { Pagination } from '@/core/data/Pagination'
import { useSearch } from '@/composables/useSearch'
import type { Subject } from '@/core/data/entities/Subject'

export type UserWithSubject = User & { subject: Subject }

export const useStudentsStore = defineStore('students-module:students', () => {
  const userService = Core.Services.User
  const uiService = Core.Services.UI

  /**
   * search
   */
  const { pagination, results, resultsMeta, isListLoading } =
    useSearch<UserWithSubject>(fetchStudents)

  /**
   * load student list
   */
  async function fetchStudents(pagination: Pagination) {
    try {
      return await userService.getOwnStudents(undefined, pagination)
    } catch (error: any) {
      uiService.openErrorModal(
        'Произошла ошибка при получении списка студентов',
        error.message
      )
    }
  }

  return { pagination, results, resultsMeta, isListLoading }
})
