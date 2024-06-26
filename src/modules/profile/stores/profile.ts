import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { type PasswordChangeForm } from '../types/PasswordChangeForm'
import { Core } from '@/core/Core'
import type { User } from '@/core/data/entities/User'

export const useProfileStore = defineStore('profile-module:profile', () => {
  const userService = Core.Services.User
  const authService = Core.Services.Auth
  const uiService = Core.Services.UI

  /*
   * logged in user
   */
  const user = ref<User | null>()

  /*
   * users mentor if its a student
   */
  const mentor = computed(() =>
    user.value?.role === 'student' ? user.value?.mentor : null
  )

  /*
   * change password form
   */
  const passwords = ref<PasswordChangeForm>({
    oldPassword: '',
    newPassword: '',
    repeatPassword: ''
  })

  /*
   * fetch user
   */
  async function fetchUser() {
    if (!Core.Context.User?.username) {
      return
    }

    uiService.setLoading(true)

    try {
      const response = await userService.getUser(Core.Context.User.username)

      user.value = response.data
    } catch (error: any) {
      uiService.openErrorModal(
        'Произошла ошибка при загрузке данных пользователя',
        'Возможно, Вам поможет перезайти. Ошибка: ' + error.message,
        [
          {
            label: 'Перезайти',
            design: 'warning',
            handler: () => authService.logout()
          }
        ]
      )
    } finally {
      uiService.setLoading(false)
    }
  }

  /*
   * change password
   */
  async function changePassword() {
    if (!user.value) return

    if (passwords.value.newPassword !== passwords.value.repeatPassword) {
      uiService.openWarningModal('Пароли не совпадают')
      return
    }

    if (!userService.validatePassword(passwords.value.newPassword)) {
      uiService.openWarningModal('Пароль не соответствует требованиям')
      return
    }

    uiService.setLoading(true)

    try {
      await userService.updateUser(user.value.id, {
        id: user.value.id,
        password: passwords.value.newPassword
      })
      uiService.openSuccessModal('Пароль успешно изменен')
    } catch (error: any) {
      uiService.openErrorModal(
        'Произошла ошибка при изменении пароля',
        error.message
      )
    } finally {
      passwords.value = {
        oldPassword: '',
        newPassword: '',
        repeatPassword: ''
      }
      uiService.setLoading(false)
    }
  }

  /*
   * delete account
   */
  async function deleteAccount() {
    if (!user.value) return

    uiService.setLoading(true)

    try {
      await userService.deleteUser(user.value.id)
      uiService.openSuccessModal('Аккаунт успешно удален')
      authService.logout()
    } catch (error: any) {
      uiService.openErrorModal(
        'Произошла ошибка при удалении аккаунта',
        error.message
      )
    } finally {
      uiService.setLoading(false)
    }
  }

  /*
   * update user credentials
   */
  async function updateCredentials() {
    if (!user.value) return

    uiService.setLoading(true)

    try {
      await userService.updateUser(user.value.id, {
        id: user.value.id,
        name: user.value.name,
        telegramUsername: user.value.telegramUsername?.replace('@', '')
      })
      uiService.openSuccessModal(
        'Данные успешно обновлены',
        'Чтобы изменения вступили в силу, обновите страницу',
        [
          {
            label: 'Обновить страницу',
            design: 'primary',
            handler: () => window.location.reload()
          }
        ]
      )
    } catch (error: any) {
      uiService.openErrorModal(
        'Произошла ошибка при обновлении данных',
        error.message
      )
    } finally {
      uiService.setLoading(false)
    }
  }

  return {
    user,
    mentor,
    passwords,
    changePassword,
    deleteAccount,
    updateCredentials,
    fetchUser
  }
})
