<template>
  <form
    class="auth-form login-form"
    @submit.prevent="authStore.login()"
    v-auto-animate
  >
    <text-input
      v-model.trim="authStore.loginCredentials.usernameOrEmail"
      placeholder="Email или никнейм"
      autocomplete
    />
    <text-input
      v-model="authStore.loginCredentials.password"
      placeholder="Пароль"
      autocomplete
      password
    />
    <error-block v-if="authStore.error">{{ authStore.error }}</error-block>
    <common-button
      type="submit"
      alignment="stretch"
      contrast
      :loading="authStore.isLoading"
    >
      Войти
    </common-button>
    <p class="login-form__forgot-password">
      <router-link to="/auth/forgot-password">Забыли пароль?</router-link>
    </p>
  </form>
</template>

<script setup lang="ts">
import { useAuthStore } from '../../stores/auth'

const authStore = useAuthStore()
</script>

<style lang="sass" scoped>
.login-form
  &__forgot-password
    margin: 0
    text-align: center
    font-size: 1.05rem

    a
      text-decoration: underline
</style>
