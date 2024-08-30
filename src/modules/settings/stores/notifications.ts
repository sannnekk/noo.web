import { Core } from '@/core/Core'
import { defineStore } from 'pinia'
import type { Notification } from '@/core/data/entities/Notification'
import type { NotificationSendOptions } from '@/core/services/store/NotificationService'

export const useSettingsNotificationsStore = defineStore(
  'settings-module:notifications',
  () => {
    const notificationService = Core.Services.Notification
    const uiService = Core.Services.UI

    async function createNotification(
      notification: Notification,
      sendOptions: NotificationSendOptions
    ) {
      try {
        await notificationService.createNotification(
          notification,
          sendOptions,
          { showLoader: true }
        )
      } catch (error: any) {
        uiService.openErrorModal(
          'Не удалось создать уведомление',
          error.message
        )
      }
    }

    return {
      createNotification
    }
  }
)
