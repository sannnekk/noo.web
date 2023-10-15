import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

export const useAuthStore = defineStore('auth', () => {
  const _router = useRouter()

  const credentials = reactive({
    username: '',
    password: ''
  })

  const isLoggingIn = ref(false)

  function login() {
    isLoggingIn.value = true

    setTimeout(() => {
      isLoggingIn.value = false
      credentials.password = ''
      _router.push('/')
    }, 900)
  }

  return { credentials, login, isLoggingIn }
})
