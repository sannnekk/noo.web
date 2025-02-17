import { defineStore } from 'pinia'
import { ref } from 'vue'
import { Core } from '@/core/Core'
import type { UserWithOnlineStatus } from '@/core/data/entities/User'
import type { AvatarData } from '../components/change-avatar-modal.vue'

export const useProfileStore = defineStore('profile-module:profile', () => {
  const userService = Core.Services.User
  const authService = Core.Services.Auth
  const uiService = Core.Services.UI

  /*
   * logged in user
   */
  const user = ref<UserWithOnlineStatus | null>()

  /*
   * fetch user
   */
  async function fetchUser() {
    if (!Core.Context.User?.username) {
      return
    }

    try {
      const response = await userService.getUser(Core.Context.User.username, {
        showLoader: true
      })

      user.value = response.data
      Core.Context.setUser(user.value!)
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
    }
  }

  /*
   * update user credentials
   */
  async function updateCredentials() {
    if (!user.value) return

    try {
      await userService.updateUser(
        user.value.id,
        {
          id: user.value.id,
          name: user.value.name,
          telegramUsername: user.value.telegramUsername?.replace('@', '')
        },
        { showLoader: true }
      )

      await fetchUser()

      uiService.openSuccessModal(
        'Данные успешно обновлены',
        'Изменения вступят полностью в силу после следующего входа на платформу',
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
    }
  }

  /**
   * request change email
   */
  async function requestChangeEmail(newEmail: string) {
    if (!user.value) return

    try {
      await userService.requestChangeEmail(user.value.id, newEmail, {
        showLoader: true
      })
      uiService.openWarningModal(
        'Запрос на изменение почты отправлен',
        'Проверьте почту для подтверждения'
      )
    } catch (error: any) {
      uiService.openErrorModal(
        'Произошла ошибка при запросе на изменение почты',
        error.message
      )
    }
  }

  /**
   * cancel change email
   */
  async function cancelChangeEmail() {
    try {
      await userService.cancelChangeEmail(Core.Context.User!.id, {
        showLoader: true
      })
      await fetchUser()
      uiService.openSuccessModal('Запрос на изменение почты отменен')
    } catch (error: any) {
      uiService.openErrorModal(
        'Произошла ошибка при отмене запроса на изменение почты',
        error.message
      )
    }
  }

  /**
   * change avatar
   */
  async function changeAvatar(avatarData: AvatarData) {
    if (!user.value) return

    try {
      await userService.updateUser(user.value.id, {
        id: user.value.id,
        avatar: {
          ...user.value.avatar!,
          media: avatarData.media.at(0) || null,
          avatarType: avatarData.useTelegramAvatar ? 'telegram' : 'custom'
        }
      })
      await fetchUser()
      uiService.openSuccessModal('Аватар успешно изменен', 'Обновите страницу')
    } catch (error: any) {
      uiService.openErrorModal(
        'Произошла ошибка при изменении аватара',
        error.message
      )
    }
  }

  return {
    user,
    updateCredentials,
    fetchUser,
    requestChangeEmail,
    cancelChangeEmail,
    changeAvatar
  }
})
