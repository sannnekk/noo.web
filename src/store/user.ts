import type { User } from '@/types/entities/User'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

export const useUserStore = defineStore('user', () => {
  const _router = useRouter()

  const user = ref<User>({
    id: '123',
    slug: 'user123',
    role: 'student',
    name: 'Мария Гришковец',
    username: 'mne_papa_ne_velel',
    email: 'maria@gmail.com',
    avatar: '/img/avatar/mascha.jpg',
    telegramId: '',
    isBlocked: false,
    forbidden: 0,
    createdAt: new Date(),
    updatedAt: new Date()
  })

  const passwordChange = ref({
    oldPassword: '',
    newPassword: '',
    newPasswordRepeat: ''
  })

  function logout() {
    _router.push('/auth')
  }

  return {
    user,
    passwordChange,
    logout
  }
})
