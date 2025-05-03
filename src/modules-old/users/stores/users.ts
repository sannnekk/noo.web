import { useSearch } from '@/composables/useSearch'
import { Core } from '@/core/Core'
import type { Pagination } from '@/core/data/Pagination'
import { defineStore } from 'pinia'

export const useUsersStore = defineStore('users-module:users', () => {
  const userService = Core.Services.User
  const subjectService = Core.Services.Subject
  const uiService = Core.Services.UI

  /**
   * Search for users
   */
  const { pagination, isListLoading, results, resultsMeta } =
    useSearch(fetchUsers)

  /**
   * Fetch users
   */
  async function fetchUsers(pagination: Pagination) {
    try {
      return await userService.getUsersWithMentors(pagination)
    } catch (error: any) {
      uiService.openErrorModal(
        'Произошла ошибка при получении списка пользователей',
        error.message
      )
    }
  }

  /**
   * Get subjects
   */
  async function fetchSubjects(pagination: Pagination) {
    try {
      return await subjectService.getSubjects(pagination)
    } catch (error: any) {
      uiService.openErrorModal(
        'Произошла ошибка при получении списка предметов',
        error.message
      )
    }
  }

  /**
   * Assign mentor to user
   */
  async function assignMentor(
    userId: string,
    mentorId: string,
    subjectId: string
  ) {
    try {
      await userService.assignMentor(userId, mentorId, subjectId, {
        showLoader: true
      })
      uiService.openSuccessModal('Куратор успешно назначен')
    } catch (error: any) {
      uiService.openErrorModal(
        'Произошла ошибка при назначении куратора',
        error.message
      )
    }
  }

  return {
    pagination,
    isListLoading,
    results,
    resultsMeta,
    fetchSubjects,
    assignMentor
  }
})
