import { Core } from '@/core/Core'
import type { User, UserWithOnlineStatus } from '@/core/data/entities/User'
import type { UserWithSubject } from '@/modules/students/stores/students'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useRoute } from 'vue-router'

export const useUserStore = defineStore('users-module:user', () => {
  const userService = Core.Services.User
  const uiService = Core.Services.UI
  const route = useRoute()

  /**
   * Current user
   */
  const user = ref<UserWithOnlineStatus | null>(null)

  /**
   * Mentor students with subjects
   */
  const studentsWithSubjects = ref<UserWithSubject[]>([])

  /**
   * Current tab index for student view
   */
  const currentTab = ref(0)

  /**
   * Fetch user by username
   */
  async function fetchUser() {
    try {
      const response = await userService.getUser(
        route.params.username as string,
        { showLoader: true }
      )
      user.value = response.data

      if (user.value?.role === 'mentor') {
        const studentsResponse = await userService.getOwnStudents(
          user.value!.id,
          {
            page: 1,
            limit: 500
          },
          { showLoader: true }
        )

        studentsWithSubjects.value = studentsResponse.data
      }
    } catch (error: any) {
      uiService.openErrorModal(
        'Произошла ошибка при получении данных пользователя',
        error.message
      )
    }
  }

  /**
   * Save user data
   */
  async function saveUser() {
    if (!user.value) {
      return
    }

    try {
      await userService.updateUser(user.value.id, user.value, {
        showLoader: true
      })
      uiService.openSuccessModal('Данные успешно сохранены')
    } catch (error: any) {
      uiService.openErrorModal(
        'Произошла ошибка при сохранении данных пользователя',
        error.message
      )
    }
  }

  /**
   * Confirm user
   */
  async function confirmUser() {
    if (!user.value) {
      return
    }

    try {
      await userService.confirmUser(user.value.username, { showLoader: true })
      uiService.openSuccessModal('Пользователь подтвержден')
      user.value.verificationToken = undefined
    } catch (error: any) {
      uiService.openErrorModal(
        'Произошла ошибка при подтверждении пользователя',
        error.message
      )
    }
  }

  /**
   * Change user password
   */
  async function changePassword(newPassword: string) {
    if (!user.value) {
      return
    }

    if (Core.Context.roleIs(['mentor', 'student', 'assistant'])) {
      uiService.openErrorModal('Недостаточно прав для изменения пароля')
      return
    }

    try {
      await userService.changePassword(user.value.id, undefined, newPassword, {
        showLoader: true
      })
      uiService.openSuccessModal('Пароль успешно изменен')
    } catch (error: any) {
      uiService.openErrorModal(
        'Произошла ошибка при изменении пароля',
        error.message
      )
    }
  }

  /**
   * Change user role
   */
  async function changeRole(role: User['role']) {
    if (!user.value) {
      return
    }

    try {
      await userService.changeRole(user.value.id, role, { showLoader: true })
      uiService.openSuccessModal('Роль успешно изменена')
      await fetchUser()
    } catch (error: any) {
      uiService.openErrorModal(
        'Произошла ошибка при изменении роли',
        error.message
      )
    }
  }

  /**
   * Toggle block user
   */
  async function block() {
    if (!user.value) {
      return
    }

    try {
      await userService.block(user.value.id, { showLoader: true })
      uiService.openSuccessModal('Пользователь заблокирован')
    } catch (error: any) {
      uiService.openErrorModal(
        'Произошла ошибка при блокировке пользователя',
        error.message
      )
    }
  }

  /**
   * Unblock user
   */
  async function unblock() {
    if (!user.value) {
      return
    }

    try {
      await userService.unblock(user.value.id, { showLoader: true })
      uiService.openSuccessModal('Пользователь разблокирован')
      await fetchUser()
    } catch (error: any) {
      uiService.openErrorModal(
        'Произошла ошибка при разблокировке пользователя',
        error.message
      )
    }
  }

  return {
    user,
    currentTab,
    studentsWithSubjects,
    fetchUser,
    saveUser,
    confirmUser,
    changePassword,
    changeRole,
    block,
    unblock
  }
})
