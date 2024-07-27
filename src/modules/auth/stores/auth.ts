import { Core } from '@/core/Core'
import {
  validateEmail,
  validateName,
  validateUsername
} from '@/core/validators/string'
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
    name: '',
    passwordIsCorrect: false,
    usernameIsValid: false
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
      error.value = 'Никнейм не может быть пустым'
      isLoading.value = false
      return
    }

    if (!validateUsername(registerCredentials.username)) {
      error.value =
        'Никнейм может содержать только латинские буквы и цифры, а также символы _ и -'
      isLoading.value = false
      return
    }

    if (!validateEmail(registerCredentials.email)) {
      error.value = 'Несуществующий имейл'
      isLoading.value = false
      return
    }

    if (!validateName(registerCredentials.name)) {
      error.value = 'Имя не может быть пустым и содержать цифры/спецсимволы'
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
    if (!validateEmail(forgotPasswordCredentials.email)) {
      error.value = 'Несуществующий имейл'
      return
    }

    try {
      await Core.Services.Auth.forgotPassword(forgotPasswordCredentials.email, {
        showLoader: true
      })
      Core.Services.UI.openSuccessModal(
        'Письмо с инструкциями отправлено на вашу почту'
      )
      mode.value = 'login'
    } catch (error: any) {
      Core.Services.UI.openErrorModal(error.message || 'Что-то пошло не так')
    }
  }

  /**
   * Verify account
   */
  async function verify() {
    if (
      !route.query.token ||
      !route.query.username ||
      route.query.verify === undefined
    ) {
      return
    }

    try {
      await Core.Services.Auth.verify(
        route.query.username as string,
        route.query.token as string,
        {
          showLoader: true
        }
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
    }
  }

  /**
   * Verify email change
   */
  async function verifyEmailChange() {
    if (
      !route.query.token ||
      !route.query.username ||
      route.query['verify-email-change'] === undefined
    ) {
      return
    }

    try {
      await Core.Services.Auth.verifyEmailChange(
        route.query.username as string,
        route.query.token as string,
        {
          showLoader: true
        }
      )
      Core.Services.UI.openSuccessModal(
        'Email успешно изменен',
        'Теперь вы можете войти в свой аккаунт'
      )
    } catch (error: any) {
      Core.Services.UI.openErrorModal(
        'Не удалось изменить email',
        error.message
      )
    }
  }

  /*
   * check and send resend verification request
   */
  async function resendVerification() {
    if (!validateEmail(resendVerificationCredentials.email)) {
      error.value = 'Несуществующий имейл'
      return
    }

    try {
      await Core.Services.Auth.resendVerification(
        resendVerificationCredentials.email,
        {
          showLoader: true
        }
      )
      Core.Services.UI.openSuccessModal(
        'Письмо с инструкциями повторно отправлено на вашу почту'
      )
      mode.value = 'login'
    } catch (error: any) {
      Core.Services.UI.openErrorModal(error.message || 'Что-то пошло не так')
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
    verify,
    verifyEmailChange
  }
})
