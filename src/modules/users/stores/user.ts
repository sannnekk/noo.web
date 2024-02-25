import { Core } from '@/core/Core'
import type { User } from '@/core/data/entities/User'
import type { Work } from '@/core/data/entities/Work'
import { defineStore } from 'pinia'
import { reactive, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

export const useUsersStore = defineStore('users-module', () => {
  const userService = Core.Services.User
  const uiService = Core.Services.UI
  const route = useRoute()

  /**
   * Current pagination
   */
  const pagination = reactive({
    page: 5,
    total: 170
  })

  /**
   * Users list
   */
  const users = ref<User[]>([])

  /**
   * Current user
   */
  const user = ref<User | null>(null)

  /**
   * Works list
   */
  const works = ref<Work[]>([])

  /**
   * Found mentors
   */
  const foundMentors = ref<User[]>([])

  /**
   * Search query for users
   */
  const search = ref('')

  /**
   * Loading state for users list
   */
  const listLoading = ref(false)

  /**
   * Search query for mentors
   */
  const mentorsSearch = ref('')

  /**
   * Load user data
   */
  watch(
    [() => route.path, search],
    async () => {
      if (route.params.username) {
        uiService.setLoading(true)

        try {
          const response = await userService.getUser(
            route.params.username as string
          )
          user.value = response.data
        } catch (error: any) {
          uiService.openErrorModal(
            'Произошла ошибка при получении данных пользователя',
            error.message
          )
        } finally {
          uiService.setLoading(false)
        }
      } else if (route.path === '/users') {
        listLoading.value = true

        try {
          const response = await userService.getUsers({
            search: search.value,
            page: pagination.page
          })
          users.value = response.data
          pagination.total = response.meta?.total || 0
        } catch (error: any) {
          uiService.openErrorModal(
            'Произошла ошибка при получении списка пользователей',
            error.message
          )
        } finally {
          listLoading.value = false
        }
      }
    },
    { immediate: true }
  )

  /**
   * Load mentor list
   */
  watch(mentorsSearch, () => {
    if (mentorsSearch.value.length > 1) {
      getMentors(mentorsSearch.value)
    }
  })

  /**
   * Get user by id
   */
  function getUser(userId: string) {
    return users.value.find((user) => user.id === userId)
  }

  /**
   * Save user data
   */
  async function saveUser() {
    if (!user.value) {
      return
    }

    uiService.setLoading(true)

    try {
      await userService.updateUser(user.value.id, user.value)
      uiService.openSuccessModal('Данные успешно сохранены')
    } catch (error: any) {
      uiService.openErrorModal(
        'Произошла ошибка при сохранении данных пользователя',
        error.message
      )
    } finally {
      uiService.setLoading(false)
    }
  }

  /**
   * Load mentors
   */
  async function getMentors(searchStr: string) {
    try {
      const response = await userService.getUsers({ search: searchStr })
      foundMentors.value = response.data
    } catch (error: any) {
      uiService.openErrorModal(
        'Произошла ошибка при получении списка кураторов',
        error.message
      )
    }
  }

  /**
   * Assign mentor to user
   */
  async function assignMentor(mentorId: string) {
    if (!user.value) {
      return
    }

    uiService.setLoading(true)

    try {
      await userService.assignMentor(user.value.id, mentorId)
      uiService.openSuccessModal('Куратор успешно назначен')
    } catch (error: any) {
      uiService.openErrorModal(
        'Произошла ошибка при назначении куратора',
        error.message
      )
    } finally {
      uiService.setLoading(false)
    }
  }

  return {
    users,
    pagination,
    user,
    search,
    listLoading,
    mentorsSearch,
    foundMentors,
    getUser,
    saveUser,
    works,
    assignMentor
  }
})
