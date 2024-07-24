import { Core } from '@/core/Core'
import type { UserWithOnlineStatus } from '@/core/data/entities/User'
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
  const user = ref<UserWithOnlineStatus | null>(null)

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

  /**
   * Change user password
   */
  async function changePassword(newPassword: string) {
    if (!user.value) {
      return
    }

    if (!['admin', 'teacher'].includes(Core.Context.User!.role)) {
      uiService.openErrorModal('Недостаточно прав для изменения пароля')
      return
    }

    uiService.setLoading(true)

    try {
      await userService.updateUser(user.value.id, {
        id: user.value.id,
        password: newPassword
      })
      uiService.openSuccessModal('Пароль успешно изменен')
    } catch (error: any) {
      uiService.openErrorModal(
        'Произошла ошибка при изменении пароля',
        error.message
      )
    } finally {
      uiService.setLoading(false)
    }
  }

  return {
    user,
    fetchUser,
    saveUser,
    confirmUser,
    changePassword
  }
})
