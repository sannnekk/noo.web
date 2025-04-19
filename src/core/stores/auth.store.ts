import { defineStore } from 'pinia'
import type { LoginPayload } from '../types/auth.types'
import type { UserInfo } from '../types/user.types'

interface AuthStore {
  userInfo?: UserInfo
  login: (payload: LoginPayload) => Promise<void>
  logout: () => Promise<void>
}

const useAuthStore = defineStore('global:auth', (): AuthStore => {
  return {}
})

export { useAuthStore }
