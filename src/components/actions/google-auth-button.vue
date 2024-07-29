<template>
  <google-login
    :client-id="Core.Constants.GOOGLE_CLIENT_ID"
    :callback="onLogin"
  />
</template>

<script setup lang="ts">
import { GoogleLogin } from 'vue3-google-login'
import { Core } from '@/core/Core'

interface Emits {
  (event: 'login', authData: any): void
}

const emits = defineEmits<Emits>()

function onLogin(response: any) {
  emits('login', response)
}
</script>

<style lang="sass" scoped>
div
	width: 100%
</style>
