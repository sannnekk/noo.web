import { Core } from '@/core/Core'
import type { User } from '@/core/data/entities/User'
import type { TelegramUpdatePayload } from '@/core/services/api/UserService'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useTelegramStore = defineStore('settings-module:telegram', () => {
  const authService = Core.Services.Auth
  const userService = Core.Services.User
  const uiService = Core.Services.UI

  const user = ref<User | null>()

  const moduleLoading = ref(false)

  /*
   * fetch user
   */
  async function fetchUser() {
    if (!Core.Context.User?.username) {
      return
    }

    moduleLoading.value = true

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
      moduleLoading.value = false
    }
  }

  /*
   * update telegram
   */
  async function bindTelegram(data: TelegramUpdatePayload | null) {
    if (!user.value || !data) return

    try {
      await userService.updateTelegram(user.value.id, data, {
        showLoader: true
      })

      user.value.telegramUsername = data.telegramUsername || undefined
      user.value.telegramId = data.telegramId || undefined

      uiService.openSuccessModal(
        data.telegramId
          ? 'Telegram успешно привязан'
          : 'Telegram успешно отвязан'
      )
    } catch (error: any) {
      uiService.openErrorModal(
        'Произошла ошибка при обновлении Telegram',
        error.message
      )
    }
  }

  /**
   * remove telegram
   */
  async function unbindTelegram() {
    await bindTelegram({
      telegramId: null,
      telegramUsername: null,
      telegramAvatarUrl: null
    })
  }

  /**
   * toggle notifications enabled
   */
  async function toggleNotificationsEnabled() {
    if (!user.value) return

    const value = user.value.telegramNotificationsEnabled

    try {
      await userService.updateUser(
        user.value.id,
        {
          id: user.value.id,
          telegramNotificationsEnabled: !value
        },
        { showLoader: true }
      )

      uiService.openSuccessModal(
        value
          ? 'Уведомления в Telegram отключены'
          : 'Уведомления в Telegram включены'
      )

      user.value.telegramNotificationsEnabled = !value
    } catch (error: any) {
      uiService.openErrorModal(
        'Произошла ошибка при обновлении настроек',
        error.message
      )
    }
  }

  return {
    moduleLoading,
    user,
    fetchUser,
    bindTelegram,
    unbindTelegram,
    toggleNotificationsEnabled
  }
})
