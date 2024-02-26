import { defineStore } from 'pinia'
import type { User } from '@/core/data/entities/User'
import { Core } from '@/core/Core'
import type { Pagination } from '@/core/data/Pagination'
import { useSearch } from '@/composables/useSearch'

export const useStudentsStore = defineStore('students-module:students', () => {
  const userService = Core.Services.User
  const uiService = Core.Services.UI

  /**
   * search
   */
  const { pagination, results, resultsMeta, isListLoading } =
    useSearch<User>(fetchStudents)

  /**
   * load student list
   */
  async function fetchStudents(pagination: Pagination) {
    try {
      return await userService.getStudents(pagination)
    } catch (error: any) {
      uiService.openErrorModal(
        'Произошла ошибка при получении списка студентов',
        error.message
      )
    }
  }

  return { pagination, results, resultsMeta, isListLoading }
})
