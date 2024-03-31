import { defineStore } from 'pinia'
import { ref } from 'vue'

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
    const navEntries = ref([
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
     * Global modal visibility state
     */
    const globalModal = ref<{
      type: 'error' | 'warning' | 'info' | 'success'
      isOpen: boolean
      title: string
      message?: string
    }>({
      type: 'info',
      isOpen: false,
      title: '',
      message: undefined
    })

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
