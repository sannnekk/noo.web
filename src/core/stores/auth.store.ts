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
import type {
  LoginPayload,
  LoginResponse,
  RegisterPayload,
  ResetPasswordPayload,
  UserInfo,
  UserRole
} from '../api/endpoints/auth.types'
import {
  useApiRequest,
  type UseApiRequestReturn
} from '../composables/useApiRequest'
import { AuthService } from '../api/endpoints/auth.service'
import { useGlobalUIStore } from './global-ui.store'

export interface AuthStore {
  userInfo: ShallowRef<UserInfo | undefined>
  isAuthenticated: ComputedRef<boolean>
  isRetryLoginModalVisible: ShallowRef<boolean>
  login: UseApiRequestReturn<LoginPayload, LoginResponse>
  retryLogin: UseApiRequestReturn<LoginPayload, LoginResponse>
  register: UseApiRequestReturn<RegisterPayload>
  forgotPassword: UseApiRequestReturn<string>
  verifyEmail: UseApiRequestReturn<string>
  resetPassword: UseApiRequestReturn<ResetPasswordPayload>
  logout: UseApiRequestReturn
  roleIsOneOf: (roles: UserRole[]) => boolean
}

const useAuthStore = defineStore('global:auth', (): AuthStore => {
  const globalUiStore = useGlobalUIStore()

  // state
  const userInfo = shallowRef<UserInfo>()
  const isAuthenticated = computed(() => !!userInfo.value)
  const router = useRouter()
  const isRetryLoginModalVisible = shallowRef(false)

  // getters
  function roleIsOneOf(roles: UserRole[]): boolean {
    if (!userInfo.value) return false

    return roles.includes(userInfo.value.role)
  }

  // requests
  const login = useApiRequest<LoginPayload, LoginResponse>(
    AuthService.login,
    (response) => {
      userInfo.value = response.data.user

      CookieStorage.set(CookieStorage.StorageAliases.user, userInfo.value)

      router.push({ name: 'root' })
    }
  )

  const retryLogin = useApiRequest<LoginPayload, LoginResponse>(
    AuthService.login,
    (response) => {
      userInfo.value = response.data.user
      isRetryLoginModalVisible.value = false

      CookieStorage.set(CookieStorage.StorageAliases.user, userInfo.value)
      globalUiStore.createSuccessToast('Вы снова в системе')
    }
  )

  const logout = useApiRequest(AuthService.removeCurrentSession, () => {
    userInfo.value = undefined
    CookieStorage.clear()
    router.push({ name: 'auth.login' })
  })

  const register = useApiRequest<RegisterPayload>(
    AuthService.register,
    () => {
      globalUiStore.createSuccessToast('Вы успешно зарегистрировались')
      router.push({ name: 'auth.login' })
    },
    (error) => {
      globalUiStore.createErrorToast('Ошибка при регистрации', error.name)
    }
  )

  const forgotPassword = useApiRequest<string>(
    AuthService.forgotPassword,
    () => {
      globalUiStore.createSuccessToast(
        'Пароль успешно сброшен',
        'Проверьте почту для получения дальнейших инструкций'
      )
      router.push({ name: 'auth.login' })
    },
    (error) => {
      globalUiStore.createErrorToast('Ошибка при сбросе пароля', error.name)
    }
  )

  const verifyEmail = useApiRequest<string>(
    AuthService.verifyEmail,
    () => {
      globalUiStore.createSuccessToast(
        'Почта успешно подтверждена',
        'Теперь вы можете войти в систему'
      )
      router.push({ name: 'auth.login' })
    },
    (error) => {
      globalUiStore.createErrorToast(
        'Ошибка при подтверждении почты',
        error.name
      )
    }
  )

  const resetPassword = useApiRequest<ResetPasswordPayload>(
    AuthService.resetPassword,
    () => {
      globalUiStore.createSuccessToast(
        'Пароль успешно изменен',
        'Теперь вы можете войти в систему'
      )
      router.push({ name: 'auth.login' })
    },
    (error) => {
      globalUiStore.createErrorToast('Ошибка при изменении пароля', error.name)
    }
  )

  // set initial state from cookies
  userInfo.value = CookieStorage.get<UserInfo>(
    CookieStorage.StorageAliases.user
  )

  // event listeners
  GlobalEventBus.on('auth:logout', logout.execute)
  GlobalEventBus.on('auth:login-expired', () => {
    isRetryLoginModalVisible.value = true
  })

  return {
    userInfo,
    isAuthenticated,
    isRetryLoginModalVisible,
    roleIsOneOf,
    login,
    retryLogin,
    register,
    forgotPassword,
    verifyEmail,
    resetPassword,
    logout
  }
})

export { useAuthStore }
