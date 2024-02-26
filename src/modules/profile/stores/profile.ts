import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { type PasswordChangeForm } from '../types/PasswordChangeForm'
import { Core } from '@/core/Core'

export const useProfileStore = defineStore('profile-module:profile', () => {
  const userService = Core.Services.User
  const authService = Core.Services.Auth
  const uiService = Core.Services.UI

  /*
   * logged in user
   */
  const user = ref(Core.Context.User)

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
        email: user.value.email,
        telegramUsername: user.value.telegramUsername
      })
      uiService.openSuccessModal(
        'Данные успешно обновлены',
        'Чтобы изменения вступили в силу, перезайдите в аккаунт или обновите страницу'
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

  /*
   * user's statistics
   */
  const charts = ref({
    firstWorkScore: 27,
    worksMadeCount: 12,
    madeBeforeDeadlineRate: 89,
    workScoreGraph: {
      labels: ['Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь', 'Январь', 'Февраль'],
      data: [
        {
          label: 'Химия',
          color: '#defba1',
          values: [15, 12, 17, 19, 18, 23]
        },
        {
          label: 'Биология',
          color: '#cdc9ff',
          values: [10, 12, 11, 13, 15, 17]
        }
      ]
    }
  })

  return {
    charts,
    user,
    mentor,
    passwords,
    changePassword,
    deleteAccount,
    updateCredentials
  }
})
