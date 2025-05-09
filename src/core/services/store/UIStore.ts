import type { IconName } from '@/components/decorations/inline-icon.vue'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export type ModalAction = {
  label: string
  design: 'primary' | 'secondary' | 'danger' | 'warning'
  handler: () => void | Promise<void>
}

export type NavEntry = {
  title: string
  icon: IconName
  route: string
  for: ('admin' | 'teacher' | 'mentor' | 'student' | 'assistant')[]
}

/**
 * Installs UI store
 */
export function installUIStore() {
  return defineStore('ui', () => {
    /**
     * Loading overlay visibility state
     */
    const isLoading = ref(false)

    /**
     * Loading progress state
     */
    const loadingProgress = ref(0)

    /**
     * Pane visibility state
     */
    const isPaneOpen = ref(false)

    /**
     * Notifications pane visibility state
     */
    const isNotificationsPaneOpen = ref(false)

    /**
     * All the navigation entries
     */
    const navEntries = ref<NavEntry[]>([
      {
        title: 'НОО.Tube',
        icon: 'nootube',
        route: '/nootube',
        for: ['admin', 'teacher', 'assistant', 'mentor', 'student']
      },
      {
        title: 'Курсы',
        icon: 'uni-cap',
        route: '/courses',
        for: ['admin', 'teacher', 'mentor', 'student', 'assistant']
      },
      {
        title: 'Работы',
        icon: 'list',
        route: '/assigned-works',
        for: ['student', 'mentor']
      },
      {
        title: 'Работы',
        icon: 'list',
        route: '/works',
        for: ['teacher', 'admin']
      },
      {
        title: 'Пользователи',
        icon: 'users',
        route: '/users',
        for: ['admin', 'teacher', 'mentor', 'assistant']
      },
      {
        title: 'Опросы',
        icon: 'poll',
        route: '/polls',
        for: ['admin', 'teacher']
      },
      {
        title: 'Календарь',
        icon: 'calender',
        route: '/calender',
        for: ['admin', 'student', 'teacher', 'mentor', 'assistant']
      },
      {
        title: 'Таблицы',
        icon: 'table',
        route: '/tables',
        for: ['mentor']
      },
      {
        title: 'Профиль',
        icon: 'user',
        route: '/profile',
        for: ['admin', 'student', 'teacher', 'mentor', 'assistant']
      },
      {
        title: 'Настройки',
        icon: 'settings',
        route: '/settings',
        for: ['admin', 'student', 'teacher', 'mentor', 'assistant']
      },
      {
        title: 'Помощь',
        icon: 'help',
        route: '/help',
        for: ['admin', 'student', 'teacher', 'mentor', 'assistant']
      }
    ])

    /**
     * Global modal state
     */
    const globalModal = ref<{
      type: 'error' | 'warning' | 'info' | 'success'
      isOpen: boolean
      title: string
      message?: string
      actions: ModalAction[]
    }>({
      type: 'info',
      isOpen: false,
      title: '',
      message: undefined,
      actions: []
    })

    /**
     * Retry login modal state
     */
    const retryLoginModal = ref<{
      isOpen: boolean
      usernameOrEmail: string
      password: string
    }>({
      isOpen: false,
      usernameOrEmail: '',
      password: ''
    })

    return {
      isLoading,
      loadingProgress,
      isPaneOpen,
      isNotificationsPaneOpen,
      navEntries,
      globalModal,
      retryLoginModal
    }
  })
}
