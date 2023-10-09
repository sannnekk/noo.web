import type { User } from '@/types/entities/User'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  const user = ref<User>({
    id: '123',
    slug: 'user123',
    role: 'student',
    name: 'Мария Гришковец',
    username: 'mne_papa_ne_velel',
    email: 'maria@gmail.com',
    avatar: 'https://picsum.photos/200/200',
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

  const charts = ref({
    firstWorkScore: 27,
    worksMadeCount: 12,
    madeBeforeDeadlineRate: 89,
    workScoreGraph: {
      labels: ['Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь', 'Январь', 'Февраль'],
      data: [
        {
          label: 'Химия',
          color: '#defba1',
          values: [15, 12, 17, 19, 18, 23]
        },
        {
          label: 'Биология',
          color: '#cdc9ff',
          values: [10, 12, 11, 13, 15, 17]
        }
      ]
    }
  })

  function logout() {}

  return {
    user,
    passwordChange,
    charts,
    logout
  }
})
