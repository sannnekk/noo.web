<template>
  <!--  <google-login
    :client-id="Core.Constants.GOOGLE_CLIENT_ID"
    :callback="onLogin"
    popup-type="CODE"
  > -->
  <common-button
    @click="login()"
    :design="design || 'secondary'"
  >
    Войти через Google
  </common-button>
</template>

<script setup lang="ts">
import { Core } from '@/core/Core'
import { googleSdkLoaded } from 'vue3-google-login'

interface Props {
  design?: 'primary' | 'secondary'
}

interface Emits {
  (event: 'login', authData: any): void
}

defineProps<Props>()
const emits = defineEmits<Emits>()

function onLogin(response: any) {
  emits('login', response)
}

function login() {
  googleSdkLoaded((google) => {
    google.accounts.oauth2
      .initCodeClient({
        client_id: Core.Constants.GOOGLE_CLIENT_ID,
        scope:
          'email profile openid https://www.googleapis.com/auth/drive.file',
        callback: onLogin
      })
      .requestCode()
  })
}
</script>

<style lang="sass" scoped>
div
	width: 100%
</style>
