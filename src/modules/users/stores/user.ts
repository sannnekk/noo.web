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
    try {
      const response = await userService.getUser(
        route.params.username as string,
        { showLoader: true }
      )
      user.value = response.data
    } catch (error: any) {
      uiService.openErrorModal(
        'Произошла ошибка при получении данных пользователя',
        error.message
      )
    }
  }

  /**
   * Save user data
   */
  async function saveUser() {
    if (!user.value) {
      return
    }

    try {
      await userService.updateUser(user.value.id, user.value, {
        showLoader: true
      })
      uiService.openSuccessModal('Данные успешно сохранены')
    } catch (error: any) {
      uiService.openErrorModal(
        'Произошла ошибка при сохранении данных пользователя',
        error.message
      )
    }
  }

  /**
   * Confirm user
   */
  async function confirmUser() {
    if (!user.value) {
      return
    }

    try {
      await userService.confirmUser(user.value.username, { showLoader: true })
      uiService.openSuccessModal('Пользователь подтвержден')
    } catch (error: any) {
      uiService.openErrorModal(
        'Произошла ошибка при подтверждении пользователя',
        error.message
      )
    }
  }

  /**
   * Change user password
   */
  async function changePassword(newPassword: string) {
    if (!user.value) {
      return
    }

    if (Core.Context.roleIs(['mentor', 'student'])) {
      uiService.openErrorModal('Недостаточно прав для изменения пароля')
      return
    }

    try {
      await userService.updateUser(
        user.value.id,
        {
          id: user.value.id,
          password: newPassword
        },
        { showLoader: true }
      )
      uiService.openSuccessModal('Пароль успешно изменен')
    } catch (error: any) {
      uiService.openErrorModal(
        'Произошла ошибка при изменении пароля',
        error.message
      )
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
