import { defineStore } from 'pinia'
import type { User } from '@/core/data/entities/User'
import { ref, watch } from 'vue'
import { Core } from '@/core/Core'
import { useRoute } from 'vue-router'

export const useStudentsStore = defineStore('students', () => {
  const userService = Core.Services.User
  const uiService = Core.Services.UI
  const route = useRoute()

  /**
   * students list
   */
  const students = ref<User[]>([])

  /**
   * load student list
   */
  watch(
    () => route.path,
    async () => {
      if (route.path === '/students') {
        uiService.setLoading(true)

        const role = Core.Context.User?.role

        if (role === 'student') {
          uiService.setLoading(false)
          uiService.openErrorModal(
            'Студенты не могут просматривать список других студентов'
          )
          return
        }

        try {
          const response = await userService.getStudents()
          students.value = response.data
        } catch (error: any) {
          uiService.openErrorModal(
            'Произошла ошибка при получении списка студентов',
            error.message
          )
        } finally {
          uiService.setLoading(false)
        }
      }
    },
    { immediate: true }
  )

  /**
   * get student by id
   */
  function getStudent(id: string) {
    return students.value.find((student) => student.id === id)
  }

  return { students, getStudent }
})
