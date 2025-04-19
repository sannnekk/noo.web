import { defineStore } from 'pinia'
import { ref } from 'vue'

interface GlobalStore {
  isLoading: boolean
}

const useAuthStore = defineStore('global', (): GlobalStore => {
  const isLoading = ref(false)

  return {
    isLoading
  }
})

export { useAuthStore }
