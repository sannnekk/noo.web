import { shallowRef } from 'vue'

function useSaveStatus() {
  const isLoading = shallowRef(false)
  const lastSavedAt = shallowRef<Date | null>(null)

  function pushSaveStatus() {
    isLoading.value = true
    lastSavedAt.value = new Date()
  }

  function reset() {
    isLoading.value = false
    lastSavedAt.value = null
  }

  return {
    isLoading,
    lastSavedAt,
    pushSaveStatus,
    reset
  }
}

export { useSaveStatus }
