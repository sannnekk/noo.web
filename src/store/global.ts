import type { User } from '@/types/entities/User'
import { http } from '@/utils/http'
import { defineStore } from 'pinia'
import { computed, reactive, ref } from 'vue'
import { useUserStore } from './user'
import { useRouter } from 'vue-router'

export const useGlobalStore = defineStore('global', () => {
  // state
  const _isLoading = ref(false)
  const _isPaneOpen = ref(false)

  const _userStore = useUserStore()
  const _router = useRouter()

  const _userRole = computed<User['role'] | null>(() => _userStore.user?.role)
  const _navEntries = ref([
    {
      title: 'Курсы',
      icon: 'uni-cap',
      route: '/materials',
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
      for: ['admin', 'teacher']
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

  const _globalModal = reactive<{
    type: 'success' | 'error' | 'warning'
    message: string
    visible: boolean
  }>({
    type: 'success',
    message: '',
    visible: false
  })

  // functions
  function setLoading(value: boolean): void {
    _isLoading.value = value
  }

  function setPaneOpen(value: boolean): void {
    _isPaneOpen.value = value
  }

  function getUserRole(): User['role'] | null {
    return _userRole.value
  }

  function openModal(
    type: 'success' | 'error' | 'warning',
    message: string
  ): void {
    _globalModal.type = type
    _globalModal.message = message
    _globalModal.visible = true
  }

  function closeModal(): void {
    _globalModal.visible = false
  }

  async function auth(
    username: string,
    password: string
  ): Promise<string | undefined> {
    setLoading(true)
    try {
      const response = await http.post(
        '/user/login',
        { username, password },
        false
      )

      localStorage.setItem('token', response.token)
      localStorage.setItem('user', JSON.stringify(response.user))
      _userStore.user = response.user

      _router.push('/')
    } catch (error: any) {
      switch (error?.status) {
        case 400:
        case 401:
          return 'Неверный логин или пароль'
        case 500:
          return 'Ошибка сервера'
        default:
          return 'Неизвестная ошибка'
      }
    } finally {
      setLoading(false)
    }
  }

  async function register(
    username: string,
    password: string,
    email: string,
    name: string
  ): Promise<string | undefined> {
    setLoading(true)

    try {
      await http.post(
        '/user/register',
        { username, password, name, email },
        false
      )
      openModal('success', 'Вы успешно зарегистрировались')
    } catch (error: any) {
      switch (error?.status) {
        case 400:
          return 'Данные введены неверно'
        case 401:
          return 'Неверный логин или пароль'
        case 409:
          return 'Пользователь с таким никнеймом уже существует'
        case 500:
          return 'Ошибка сервера'
        default:
          return 'Неизвестная ошибка'
      }
    } finally {
      setLoading(false)
    }
  }

  // getters
  const navEntries = computed(() => {
    return _navEntries.value.filter((entry) =>
      entry.for.includes(_userRole.value || '?')
    )
  })

  return {
    _isLoading,
    _isPaneOpen,
    _userRole,
    _globalModal,
    setLoading,
    setPaneOpen,
    getUserRole,
    openModal,
    closeModal,
    navEntries,
    auth,
    register
  }
})
