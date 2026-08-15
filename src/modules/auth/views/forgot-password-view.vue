<template>
  <auth-panel
    title="Восстановление пароля"
    logo
  >
    <forgot-password-form />
  </auth-panel>
</template>

<script lang="ts" setup>
import AuthPanel from '../components/auth-panel.vue'
import ForgotPasswordForm from '../components/forms/forgot-password-form.vue'
</script>
