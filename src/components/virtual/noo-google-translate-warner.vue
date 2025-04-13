<template>
  <warning-block v-if="googleTranslateDetected">
    Похоже, Вы используете расширение Google Translate для Вашего браузера.
    Пожалуйста, отключите его и перезагрузите страницу для корректной работы
    платформы
  </warning-block>
  <br v-if="googleTranslateDetected" />
</template>

<script lang="ts" setup>
import { debounce } from '@/core/utils/debounce'
import { ref, onMounted, onBeforeUnmount } from 'vue'

const googleTranslateDetected = ref(false)

let observer: MutationObserver | null = null

async function detectGoogleTranslate(): Promise<boolean> {
  return new Promise<boolean>((resolve) => {
    // Check for the global 'google' object and its 'translate' property
    if (window.google && (window.google as any).translate) {
      return resolve(true)
    }

    // Check goog-gt-tt id
    if (document.getElementById('goog-gt-tt')) {
      return resolve(true)
    }

    // Check for specific iframes added by the extension
    if (
      document.querySelector('.goog-te-banner-frame') ||
      document.querySelector('.goog-te-menu-frame')
    ) {
      return resolve(true)
    }

    // Check for elements with classes that start with 'goog-t'
    if (document.querySelector('[class^="goog-t"]')) {
      return resolve(true)
    }

    return resolve(false)
  })
}

onMounted(async () => {
  if (await detectGoogleTranslate()) {
    googleTranslateDetected.value = true
  } else {
    console.log('Google Translate is not detected')
    googleTranslateDetected.value = false
  }

  observer = new MutationObserver(
    debounce(async () => {
      if (await detectGoogleTranslate()) {
        googleTranslateDetected.value = true
        //observer?.disconnect()
      } else {
        googleTranslateDetected.value = false
        console.log('Google Translate is not detected')
      }
    }, 3000)
  )

  observer.observe(document.body, { childList: true, subtree: true })
})

onBeforeUnmount(() => {
  observer?.disconnect()
})
</script>
