<template>
  <auth-layout>
    <template #promo>
      <register-promo v-if="$route.meta.promo === 'register'" />
      <login-promo v-else />
    </template>
    <router-view />
  </auth-layout>
</template>

<script lang="ts" setup>
import AuthLayout from '../components/auth-layout.vue'
import LoginPromo from '../components/promo/login-promo.vue'
import RegisterPromo from '../components/promo/register-promo.vue'
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()

authStore.verify()
authStore.verifyEmailChange()
</script>
