import { computed, ref } from 'vue'

function useLoading() {
  const isLoading = ref(false)

  function start() {
    isLoading.value = true
  }

  function stop() {
    isLoading.value = false
  }

  return {
    isLoading: computed(() => isLoading.value),
    start,
    stop
  }
}

export { useLoading }
