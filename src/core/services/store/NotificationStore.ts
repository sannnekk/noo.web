import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'
import type { Notification } from '@/core/data/entities/Notification'

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
    const newNotifications = ref<Notification[]>([])

    /**
     * Banners (notifications that are shown on top of the page)
     */
    const banners = ref<Notification[]>([])

    /**
     * Banner modal state
     */
    const bannerModal = reactive({
      isOpen: false,
      banner: null as Notification | null,
      banners: [] as Notification[],
      onClose: () => {
        bannerModal.isOpen = false
        bannerModal.banner = null
        bannerModal.banners.shift()

        if (bannerModal.banners.length > 0) {
          bannerModal.banner = bannerModal.banners[0]
          bannerModal.isOpen = true
        }
      }
    })

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

    /**
     * Show banners one by one
     */
    function showBannersOneByOne(banners: Notification[]) {
      bannerModal.banners = banners

      if (banners.length > 0) {
        bannerModal.banner = banners[0]
        bannerModal.isOpen = true
      }
    }

    return {
      isLoading,
      isPaneOpen,
      unreadCount,
      loadingError,
      notifications,
      newNotifications,
      banners,
      bannerModal,
      showOneByOne,
      showBannersOneByOne
    }
  })
}
