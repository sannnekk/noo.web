import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Notification } from '@/core/data/entities/Notification'

export type BannerNotification = Notification & {
  visible: boolean
  visibilityThreshold: number
}

/**
 * Installs Notifications store
 */
export function installNotificationStore() {
  return defineStore('notification', () => {
    /**
     * Loading overlay visibility state
     */
    const isLoading = ref(false)

    /**
     * Loading error message
     */
    const loadingError = ref<string>()

    /**
     * Unread notifications count
     */
    const unreadCount = ref(0)

    /**
     * Pane visibility state
     */
    const isPaneOpen = ref(false)

    /**
     * Notifications
     */
    const notifications = ref<Notification[]>([])

    /**
     * Notifications to show
     */
    const newNotifications = ref<BannerNotification[]>([])

    /**
     * Show notifications one by one
     */
    function showOneByOne(notifications: Notification[]) {
      newNotifications.value = notifications.map((notification, index) => {
        return {
          ...notification,
          visible: false,
          visibilityThreshold: index * 200
        }
      })
    }

    return {
      isLoading,
      isPaneOpen,
      unreadCount,
      loadingError,
      notifications,
      newNotifications,
      showOneByOne
    }
  })
}
