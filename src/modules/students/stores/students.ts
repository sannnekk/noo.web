import { defineStore } from 'pinia'
import type { User } from '@/types/entities/User'
import { reactive } from 'vue'
import { http } from '@/utils/http'
import { useGlobalStore } from '@/store'

export const useStudentsStore = defineStore('students', () => {
  const _globalStore = useGlobalStore()

  const students = reactive<User[]>([
    /* {
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
      role: 'student',
      email: 'maria@gmail.com',
      avatar: 'https://i.pravatar.cc/150?img=2',
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
      role: 'student',
      email: 'sidorov@s.ru',
      avatar: 'https://i.pravatar.cc/150?img=3',
      isBlocked: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      telegramId: '1234567890'
    } */
  ])

  _globalStore.setLoading(true)

  http
    .get('/user')
    .then((data) => {
      students.splice(0, students.length)
      students.push(...data)
    })
    .catch(() => {
      _globalStore.openModal('error', 'Ошибка при загрузке пользователей')
    })
    .finally(() => {
      _globalStore.setLoading(false)
    })

  function getStudent(id: string) {
    return students.find((student) => student.id === id)
  }

  return { students, getStudent }
})
