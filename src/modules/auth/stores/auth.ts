import { Core } from '@/core/Core'
import { defineStore } from 'pinia'
import { reactive, ref, watch } from 'vue'

export const useAuthStore = defineStore('auth-module:auth', () => {
  /*
   * current mode (login, register, forgot-password)
   */
  const mode = ref<'login' | 'register' | 'forgot-password'>('login')

  watch(mode, () => {
    error.value = undefined
  })

  /*
   * login, register, forgot password credentials
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
    isLoading.value = true

    if (
      /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(
        forgotPasswordCredentials.email
      ) === false
    ) {
      error.value = 'Несуществующий имейл'
      isLoading.value = false
      return
    }

    try {
      await Core.Services.Auth.forgotPassword(forgotPasswordCredentials.email)
    } catch (e: any) {
      error.value = e.message
    } finally {
      isLoading.value = false
    }
  }

  return {
    loginCredentials,
    registerCredentials,
    forgotPasswordCredentials,
    login,
    register,
    forgotPassword,
    isLoading,
    error,
    mode
  }
})
