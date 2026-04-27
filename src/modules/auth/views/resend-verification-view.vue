<template>
  <div class="index-auth-view__auth-titles">
    <auth-titles mode="resend-verification" />
  </div>
  <div class="index-auth-view__auth-form">
    <auth-form
      v-model:auth-credentials="authStore.loginCredentials"
      v-model:register-credentials="authStore.registerCredentials"
      v-model:forgot-password-credentials="authStore.forgotPasswordCredentials"
      v-model:resend-verification-credentials="
        authStore.resendVerificationCredentials
      "
      mode="resend-verification"
      :error="authStore.error"
      :is-loading="authStore.isLoading"
      :username-exists="authStore.usernameExists"
      @login="authStore.login()"
      @register="authStore.register()"
      @forgot-password="authStore.forgotPassword()"
      @resend-verification="authStore.resendVerification()"
    />
  </div>
</template>

<script lang="ts" setup>
import AuthTitles from '../components/auth-titles.vue'
import AuthForm from '../components/auth-form.vue'
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()
</script>
