<template>
  <form
    class="auth-form"
    @submit.prevent="authStore.resendVerification()"
    v-auto-animate
  >
    <text-input
      v-model.trim="authStore.resendVerificationCredentials.email"
      placeholder="Почта"
    />
    <error-block v-if="authStore.error">{{ authStore.error }}</error-block>
    <common-button
      type="submit"
      alignment="stretch"
      contrast
      :loading="authStore.isLoading"
    >
      Отправить
    </common-button>
    <auth-form-links
      :links="[
        { to: '/auth', label: 'Войти' },
        { to: '/auth/register', label: 'Зарегистрироваться' },
        { to: '/auth/forgot-password', label: 'Забыли пароль?' }
      ]"
    />
  </form>
</template>

<script setup lang="ts">
import AuthFormLinks from './auth-form-links.vue'
import { useAuthStore } from '../../stores/auth'

const authStore = useAuthStore()
</script>
