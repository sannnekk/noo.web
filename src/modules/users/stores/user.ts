import type { User } from '@/types/entities/User'
import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'

export const useUsersStore = defineStore('', () => {
  const users = reactive<User[]>([
    {
      id: '1',
      slug: '1',
      name: 'Иванов Иван Иванович',
      username: 'nukleoid',
      role: 'student',
      email: 'nukleoid@outlook.com',
      avatar: 'https://i.pravatar.cc/150?img=1',
      isBlocked: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      telegramId: '1234567890'
    },
    {
      id: '2',
      slug: '2',
      name: 'Петров Петр Петрович',
      username: 'petrov',
      role: 'admin',
      email: 'maria@gmail.com',
      isBlocked: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      telegramId: '1234567890'
    },
    {
      id: '3',
      slug: '3',
      name: 'Сидоров Сидор Сидорович',
      username: 'sidorov',
      role: 'mentor',
      email: 'sidorov@s.ru',
      avatar: 'https://i.pravatar.cc/150?img=3',
      isBlocked: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      telegramId: '1234567890'
    },
    {
      id: '4',
      slug: '4',
      name: 'Мария Иванова',
      username: 'maria',
      role: 'teacher',
      email: 'teacher@noo.ru',
      avatar: 'https://i.pravatar.cc/150?img=4',
      isBlocked: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      telegramId: '1234567890'
    }
  ])

  const search = ref('')

  return { users, search }
})
