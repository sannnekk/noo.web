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
  for: ('admin' | 'teacher' | 'mentor' | 'student')[]
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
     * Pane visibility state
     */
    const isPaneOpen = ref(false)

    /**
     * All the navigation entries
     */
    const navEntries = ref<NavEntry[]>([
      {
        title: 'Блог/Новости',
        icon: 'home',
        route: '/blog',
        for: ['admin', 'teacher', 'mentor', 'student']
      },
      {
        title: 'Курсы',
        icon: 'uni-cap',
        route: '/courses',
        for: ['admin', 'teacher', 'mentor', 'student']
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
        title: 'Мои ученики',
        icon: 'student',
        route: '/students',
        for: ['mentor']
      },
      {
        title: 'Пользователи',
        icon: 'users',
        route: '/users',
        for: ['admin', 'teacher', 'mentor']
      },
      {
        title: 'Календарь',
        icon: 'calender',
        route: '/calender',
        for: ['admin', 'student', 'teacher', 'mentor']
      },
      {
        title: 'Профиль',
        icon: 'user',
        route: '/profile',
        for: ['admin', 'student', 'teacher', 'mentor']
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
      isPaneOpen,
      navEntries,
      globalModal,
      retryLoginModal
    }
  })
}
