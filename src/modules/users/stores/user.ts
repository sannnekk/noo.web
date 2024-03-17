import { useSearch } from '@/composables/useSearch'
import { Core } from '@/core/Core'
import type { Pagination } from '@/core/data/Pagination'
import type { User } from '@/core/data/entities/User'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useRoute } from 'vue-router'

export const useUserStore = defineStore('users-module:user', () => {
  const userService = Core.Services.User
  const uiService = Core.Services.UI
  const route = useRoute()

  /**
   * Current user
   */
  const user = ref<User | null>(null)

  /**
   * Mentors search
   */
  const mentorSearch = useSearch(fetchMentors)

  /**
   * Fetch mentors
   */
  async function fetchMentors(pagination: Pagination) {
    try {
      return await userService.getMentors(pagination)
    } catch (error: any) {
      uiService.openErrorModal(
        'Произошла ошибка при получении списка кураторов',
        error.message
      )
    }
  }

  /**
   * Fetch user by username
   */
  async function fetchUser() {
    uiService.setLoading(true)

    try {
      const response = await userService.getUser(
        route.params.username as string
      )
      user.value = response.data
    } catch (error: any) {
      uiService.openErrorModal(
        'Произошла ошибка при получении данных пользователя',
        error.message
      )
    } finally {
      uiService.setLoading(false)
    }
  }

  /**
   * Save user data
   */
  async function saveUser() {
    if (!user.value) {
      return
    }

    uiService.setLoading(true)

    try {
      await userService.updateUser(user.value.id, user.value)
      uiService.openSuccessModal('Данные успешно сохранены')
    } catch (error: any) {
      uiService.openErrorModal(
        'Произошла ошибка при сохранении данных пользователя',
        error.message
      )
    } finally {
      uiService.setLoading(false)
    }
  }

  /**
   * Assign mentor to user
   */
  async function assignMentor(mentorId: string) {
    if (!user.value) {
      return
    }

    uiService.setLoading(true)

    try {
      await userService.assignMentor(user.value.id, mentorId)
      uiService.openSuccessModal('Куратор успешно назначен')
    } catch (error: any) {
      uiService.openErrorModal(
        'Произошла ошибка при назначении куратора',
        error.message
      )
    } finally {
      uiService.setLoading(false)
    }
  }

  /**
   * Confirm user
   */
  async function confirmUser() {
    if (!user.value) {
      return
    }

    uiService.setLoading(true)

    try {
      await userService.confirmUser(user.value.username)
      uiService.openSuccessModal('Пользователь подтвержден')
    } catch (error: any) {
      uiService.openErrorModal(
        'Произошла ошибка при подтверждении пользователя',
        error.message
      )
    } finally {
      uiService.setLoading(false)
    }
  }

  return {
    mentorSearch,
    user,
    fetchUser,
    saveUser,
    assignMentor,
    confirmUser
  }
})
