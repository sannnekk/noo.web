import { defineStore } from 'pinia'
import { shallowRef, computed, type ShallowRef } from 'vue'

interface NotificationsStore {
  unreadCount: ShallowRef<number>
  readNotifications: ShallowRef<Notification[]>
  unreadNotifications: ShallowRef<Notification[]>
  markAllAsRead: () => Promise<void>
  addNotification: (
    notification: Notification,
    options: NotificationCreateOptions
  ) => void
  deleteNotification: (notificationId: string) => void
}

type NotificationCreateOptions = {
  persist?: boolean
  toast?: boolean
}

const useNotificationsStore = defineStore(
  'global:notifications',
  (): NotificationsStore => {
    const readNotifications = shallowRef<Notification[]>([])
    const unreadNotifications = shallowRef<Notification[]>([])
    const unreadCount = computed(() => unreadNotifications.value.length)

    function addNotification(
      notification: Notification,
      options: NotificationCreateOptions
    ): void {}

    async function markAllAsRead(): Promise<void> {}

    async function deleteNotification(notificationId: string): Promise<void> {}

    return {
      unreadCount,
      readNotifications,
      unreadNotifications,
      markAllAsRead,
      addNotification,
      deleteNotification
    }
  }
)

export { useNotificationsStore }
