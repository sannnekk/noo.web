import { ref, watch } from 'vue'

export function useDevice() {
  const isMobile = ref(window.innerWidth <= 960)

  const isDesktop = ref(window.innerWidth > 960)

  const height = ref(window.innerHeight)

  const width = ref(window.innerWidth)

  window.addEventListener('resize', () => {
    height.value = window.innerHeight
    width.value = window.innerWidth
    isMobile.value = window.innerWidth <= 960
    isDesktop.value = window.innerWidth > 960
  })

  return {
    isMobile,
    isDesktop,
    height,
    width
  }
}
