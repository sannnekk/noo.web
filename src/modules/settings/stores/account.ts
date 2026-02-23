import { Core } from '@/core/Core'
import { defineStore } from 'pinia'
import type { PasswordChangeForm } from '../types/account/PasswordChangeForm'

export const useAccountStore = defineStore('settings-module:account', () => {
  const userService = Core.Services.User
  const authService = Core.Services.Auth
  const uiService = Core.Services.UI

  const userId = Core.Context.User!.id

  /*
   * change password
   */
  async function changePassword(passwordForm: PasswordChangeForm) {
    try {
      await userService.changePassword(
        userId,
        passwordForm.oldPassword,
        passwordForm.newPassword,
        { showLoader: true }
      )
      uiService.openSuccessModal('Пароль успешно изменен')
    } catch (error: any) {
      uiService.openErrorModal(
        'Произошла ошибка при изменении пароля',
        error.message
      )
    }
  }

  /*
   * delete account
   */
  async function deleteAccount(password: string) {
    try {
      if (!password?.length) {
        throw new Error('Введите пароль')
      }

      await userService.deleteUser(userId, password, { showLoader: true })
      uiService.openSuccessModal('Аккаунт успешно удален')
      await authService.logout()
    } catch (error: any) {
      uiService.openErrorModal(
        'Произошла ошибка при удалении аккаунта',
        error.message
      )
    }
  }

  return {
    changePassword,
    deleteAccount
  }
})
