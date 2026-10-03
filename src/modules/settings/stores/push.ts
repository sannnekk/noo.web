import { Core } from '@/core/Core'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const usePushStore = defineStore('settings-module:push', () => {
  const pushService = Core.Services.Push
  const uiService = Core.Services.UI

  const isSupported = ref(pushService.isSupported())

  const needsInstall = ref(pushService.needsInstall())

  const permission = ref<NotificationPermission>(pushService.getPermission())

  const isEnabled = ref(false)

  const isLoading = ref(false)

  /**
   * fetch current state of this browser
   */
  async function fetchState() {
    if (!isSupported.value) {
      return
    }

    isLoading.value = true

    try {
      permission.value = pushService.getPermission()
      const subscription = await pushService.getCurrentSubscription()
      isEnabled.value = !!subscription && permission.value === 'granted'

      // keep the server in sync in case the subscription was lost there
      if (subscription && isEnabled.value) {
        await pushService.subscribe(subscription.toJSON())
      }
    } catch (error: any) {
      isEnabled.value = false
    } finally {
      isLoading.value = false
    }
  }

  /**
   * toggle push notifications for this browser
   */
  async function toggle() {
    const value = isEnabled.value

    try {
      if (value) {
        await pushService.disable({ showLoader: true })
      } else {
        await pushService.enable({ showLoader: true })
      }

      isEnabled.value = !value

      uiService.openSuccessModal(
        value
          ? 'Push-уведомления в этом браузере отключены'
          : 'Push-уведомления в этом браузере включены'
      )
    } catch (error: any) {
      uiService.openErrorModal(
        'Произошла ошибка при обновлении push-уведомлений',
        error.message
      )
    } finally {
      permission.value = pushService.getPermission()
    }
  }

  return {
    isSupported,
    needsInstall,
    permission,
    isEnabled,
    isLoading,
    fetchState,
    toggle
  }
})
