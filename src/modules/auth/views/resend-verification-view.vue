<template>
  <auth-panel
    title="Подтверждение почты"
    logo
  >
    <resend-verification-form />
  </auth-panel>
</template>

<script lang="ts" setup>
import AuthPanel from '../components/auth-panel.vue'
import ResendVerificationForm from '../components/forms/resend-verification-form.vue'
</script>
