import type { User } from '@/types/entities/User'
import { defineStore } from 'pinia'
import { computed, readonly, ref } from 'vue'

export const useGlobalStore = defineStore('global', () => {
  // state
  const _isLoading = ref(false)
  const _isPaneOpen = ref(false)

  const _userRole = ref<User['role'] | null>('student')
  const _navEntries = ref([
    {
      title: 'Главная',
      icon: 'home',
      route: '/',
      for: ['admin', 'student', 'teacher', 'mentor']
    },
    {
      title: 'Мои курсы',
      icon: 'uni-cap',
      route: '/materials',
      for: ['admin', 'teacher', 'mentor', 'student']
    },
    {
      title: 'Работы',
      icon: 'list',
      route: '/works',
      for: ['student', 'mentor']
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
      for: ['admin']
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
    setLoading,
    setPaneOpen,
    getUserRole,
    navEntries
  }
})
