import { useGlobalStore } from '@/store'
import { defineStore } from 'pinia'
import { reactive, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

export const useAuthStore = defineStore('auth', () => {
  const _globalStore = useGlobalStore()

  const mode = ref<'login' | 'register' | 'forgot-password'>('login')

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
    passwordCriteria: [
      {
        errorText: 'Пароль должен содержать не менее 8 символов',
        label: '8 или более символов',
        isValid: (password: string) => password.length >= 8
      },
      {
        errorText: 'Пароль должен содержать не менее 1 цифры',
        label: '1 цифра',
        isValid: (password: string) => /\d/.test(password)
      },
      {
        errorText:
          'Пароль должен содержать не менее 1 символа в верхнем регистре',
        label: '1 заглавная буква',
        isValid: (password: string) => /[A-Z]/.test(password)
      },
      {
        errorText:
          'Пароль должен содержать не менее 1 символа в нижнем регистре',
        label: '1 строчная буква',
        isValid: (password: string) => /[a-z]/.test(password)
      }
    ]
  })

  const forgotPasswordCredentials = reactive({
    email: ''
  })

  const error = ref<string>()
  const isLoading = ref(false)

  watch(mode, () => {
    error.value = undefined
  })

  async function login() {
    isLoading.value = true

    error.value = await _globalStore.auth(
      loginCredentials.usernameOrEmail,
      loginCredentials.password
    )

    isLoading.value = false
    loginCredentials.password = ''
  }

  async function register() {
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

    if (
      registerCredentials.passwordCriteria.some(
        (criteria) => !criteria.isValid(registerCredentials.password)
      )
    ) {
      error.value = registerCredentials.passwordCriteria.find(
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

    error.value = await _globalStore.register(
      registerCredentials.username,
      registerCredentials.password,
      registerCredentials.email,
      registerCredentials.name
    )

    if (!error.value) {
      mode.value = 'login'
    }

    isLoading.value = false
    registerCredentials.password = ''
    registerCredentials.repeatPassword = ''
  }

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

    error.value = await _globalStore.forgotPassword(
      forgotPasswordCredentials.email
    )

    isLoading.value = false
    forgotPasswordCredentials.email = ''
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
