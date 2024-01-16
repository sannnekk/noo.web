import type { User } from '@/types/entities/User'
import { http } from '@/utils/http'
import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useGlobalStore } from './global'

export const useUserStore = defineStore('user', () => {
  const _router = useRouter()
  const _globalStore = useGlobalStore()

  const user = ref<User>(JSON.parse(localStorage.getItem('user') || '{}'))

  watch(
    user,
    (value) => {
      if (!value || !(value as any).id) {
        if (_router.currentRoute.value.path !== '/auth') {
          _router.push('/auth')
        }
      }
    },
    { immediate: true }
  )

  function logout() {
    localStorage.clear()
    location.reload()
  }

  async function onCredentialsUpdate() {
    try {
      await http.patch(`/user/${user.value.id}`, {
        ...user.value,
        password: undefined
      })
      _globalStore.openModal('success', 'Данные успешно изменены')
    } catch (error) {
      console.log(error)
      _globalStore.openModal('error', 'Ошибка при изменении данных')
    }
  }

  async function onPasswordChange(newPassword: string) {
    try {
      await http.patch(`/user/${user.value.id}`, {
        ...user.value,
        password: newPassword
      })
      _globalStore.openModal('success', 'Пароль успешно изменен')
    } catch (error) {
      _globalStore.openModal('error', 'Ошибка при изменении пароля')
    }
  }

  async function deleteAccount() {
    _globalStore.setLoading(true)
    try {
      await http.remove(`/user/${user.value.id}`)
      _globalStore.openModal('success', 'Аккаунт успешно удален')
      logout()
    } catch (error) {
      _globalStore.openModal('error', 'Ошибка при удалении аккаунта')
    } finally {
      _globalStore.setLoading(false)
    }
  }

  return {
    user,
    logout,
    onCredentialsUpdate,
    onPasswordChange,
    deleteAccount
  }
})
