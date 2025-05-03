import { defineStore } from 'pinia'
import {
  computed,
  reactive,
  shallowRef,
  type ComputedRef,
  type ShallowRef
} from 'vue'
import { useRouter } from 'vue-router'
import { CookieStorage } from '../utils/cookies.utils'
import { GlobalEventBus } from '../events/event-bus'
import { useModal } from '../composables/useRetryModal'
import type {
  LoginPayload,
  LoginResponse,
  RegisterPayload,
  ResetPasswordPayload,
  UserInfo
} from '../api/endpoints/auth.types'
import { useApiRequest } from '../composables/useApiRequest'
import { AuthService } from '../api/endpoints/auth.service'
import type { ApiError } from '../api/api.utils'

export interface AuthStore {
  userInfo: ShallowRef<UserInfo | undefined>
  retryLoginModal: ReturnType<typeof useModal>
  isAuthenticated: ComputedRef<boolean>
  loginRequest: (payload: LoginPayload, context: LoginContext) => Promise<void>
  register: (payload: LoginPayload) => Promise<void>
  forgotPassword: (email: string) => Promise<void>
  verifyEmail: (token: string) => Promise<void>
  resetPassword: (token: string, newPassword: string) => Promise<void>
  logout: () => Promise<void>
}

export type LoginContext = 'login' | 'retry-login'

export type RetryLoginModal = {
  visible: boolean
  username: string
  loading: boolean
  error: ApiError | null
}

const useAuthStore = defineStore('global:auth', (): AuthStore => {
  // state
  const userInfo = shallowRef<UserInfo>()
  const isAuthenticated = computed(() => !!userInfo.value)
  const router = useRouter()
  const retryLoginModal = reactive<RetryLoginModal>({
    visible: false,
    username: '',
    loading: false,
    error: null
  })

  // requests
  const requests = {
    login: useApiRequest<LoginPayload, LoginResponse>((payload) =>
      AuthService.login(payload)
    ),
    register: useApiRequest<RegisterPayload>((payload) =>
      AuthService.register(payload)
    ),
    forgotPassword: useApiRequest<string>((email) =>
      AuthService.forgotPassword(email)
    ),
    verifyEmail: useApiRequest<string>((token) =>
      AuthService.verifyEmail(token)
    ),
    resetPassword: useApiRequest<ResetPasswordPayload>((payload) =>
      AuthService.resetPassword(payload)
    ),
    removeCurrentSession: useApiRequest<void>(() =>
      AuthService.removeCurrentSession()
    )
  } as const

  // actions
  async function login(): Promise<void> {}

  async function logout(): Promise<void> {
    await requests.removeCurrentSession.execute()

    CookieStorage.clear()
    userInfo.value = undefined

    await router.push({ name: 'auth.login' })
  }

  GlobalEventBus.on('auth:logout', logout)

  return {
    userInfo,
    isAuthenticated,
    retryLoginModal,
    loginRequest: requests.login,
    register,
    forgotPassword,
    verifyEmail,
    resetPassword,
    logout
  }
})

export { useAuthStore }
