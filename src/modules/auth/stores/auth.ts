import { Core } from '@/core/Core'
import { defineStore } from 'pinia'
import { reactive, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

export const useAuthStore = defineStore('auth-module:auth', () => {
  const route = useRoute()

  /*
   * current mode (login, register, forgot-password)
   */
  const mode = ref<
    'login' | 'register' | 'forgot-password' | 'resend-verification'
  >('login')

  watch(mode, () => {
    error.value = undefined
  })

  /*
   * login, register, forgot password and resend verification credentials
   */
  const loginCredentials = reactive({
    usernameOrEmail: '',
    password: ''
  })

  const registerCredentials = reactive({
    username: '',
    password: '',
    repeatPassword: '',
    email: '',
    name: ''
  })

  const forgotPasswordCredentials = reactive({
    email: ''
  })

  const resendVerificationCredentials = reactive({
    email: ''
  })

  /*
   * error message
   */
  const error = ref<string>()

  /*
   * local loading state
   */
  const isLoading = ref(false)

  /*
   * send login request
   */
  async function login() {
    isLoading.value = true

    try {
      await Core.Services.Auth.login(loginCredentials)
    } catch (e: any) {
      error.value = e.message
    } finally {
      isLoading.value = false
      loginCredentials.password = ''
    }
  }

  /*
   * check and send register request
   */
  async function register() {
    const passwordCriteria = Core.Services.User.passwordCriteria()
    isLoading.value = true

    if (!registerCredentials.password || !registerCredentials.repeatPassword) {
      error.value = 'Пароль не может быть пустым'
      isLoading.value = false
      return
    }

    if (registerCredentials.password !== registerCredentials.repeatPassword) {
      error.value = 'Пароли не совпадают'
      isLoading.value = false
      return
    }

    if (!Core.Services.User.validatePassword(registerCredentials.password)) {
      error.value = passwordCriteria.find(
        (criteria) => !criteria.isValid(registerCredentials.password)
      )?.errorText
      isLoading.value = false
      return
    }

    if (!registerCredentials.username) {
      error.value = 'Имя пользователя не может быть пустым'
      isLoading.value = false
      return
    }

    if (!registerCredentials.username.match(/^[A-Za-z0-9_-]+$/i)) {
      error.value =
        'Имя пользователя может содержать только латинские буквы и цифры, а также символы _ и -'
      isLoading.value = false
      return
    }

    if (
      /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(
        registerCredentials.email
      ) === false
    ) {
      error.value = 'Несуществующий имейл'
      isLoading.value = false
      return
    }

    if (!registerCredentials.name) {
      error.value = 'Имя не может быть пустым'
      isLoading.value = false
      return
    }

    try {
      await Core.Services.Auth.register(registerCredentials)
      Core.Services.UI.openSuccessModal(
        'Регистрация прошла успешно',
        'Чтобы продолжить, подтвердите свой имейл. Письмо с инструкциями отправлено на вашу почту'
      )
      mode.value = 'login'
    } catch (e: any) {
      error.value = e.message
    } finally {
      isLoading.value = false
      registerCredentials.password = ''
      registerCredentials.repeatPassword = ''
    }

    if (!error.value) {
      mode.value = 'login'
    }
  }

  /*
   * check and send forgot password request
   */
  async function forgotPassword() {
    if (
      /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(
        forgotPasswordCredentials.email
      ) === false
    ) {
      error.value = 'Несуществующий имейл'
      return
    }

    Core.Services.UI.setLoading(true)

    try {
      await Core.Services.Auth.forgotPassword(forgotPasswordCredentials.email)
      Core.Services.UI.openSuccessModal(
        'Письмо с инструкциями отправлено на вашу почту'
      )
      mode.value = 'login'
    } catch (error: any) {
      error.value = error.message || 'Что-то пошло не так'
    } finally {
      Core.Services.UI.setLoading(false)
    }
  }

  /**
   * Verify account
   */
  async function verify() {
    if (!route.query.token || !route.query.username) {
      return
    }

    Core.Services.UI.setLoading(true)

    try {
      await Core.Services.Auth.verify(
        route.query.username as string,
        route.query.token as string
      )
      Core.Services.UI.openSuccessModal(
        'Аккаунт подтвержден',
        'Теперь вы можете войти в свой аккаунт'
      )
    } catch (error: any) {
      Core.Services.UI.openErrorModal(
        'Не удалось подтвердить аккаунт',
        error.message
      )
    } finally {
      Core.Services.UI.setLoading(false)
    }
  }

  /*
   * check and send resend verification request
   */
  async function resendVerification() {
    if (
      /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(
        resendVerificationCredentials.email
      ) === false
    ) {
      error.value = 'Несуществующий имейл'
      return
    }

    Core.Services.UI.setLoading(true)

    try {
      await Core.Services.Auth.resendVerification(
        resendVerificationCredentials.email
      )
      Core.Services.UI.openSuccessModal(
        'Письмо с инструкциями повторно отправлено на вашу почту'
      )
      mode.value = 'login'
    } catch (error: any) {
      error.value = error.message || 'Что-то пошло не так'
    } finally {
      Core.Services.UI.setLoading(false)
    }
  }

  return {
    loginCredentials,
    registerCredentials,
    forgotPasswordCredentials,
    resendVerificationCredentials,
    login,
    register,
    forgotPassword,
    resendVerification,
    isLoading,
    error,
    mode,
    verify
  }
})
