<template>
  <auth-panel
    title="Вход в систему"
    logo
  >
    <login-form />
    <register-promo-card class="login-view__promo-card" />
  </auth-panel>
</template>

<script lang="ts" setup>
import AuthPanel from '../components/auth-panel.vue'
import LoginForm from '../components/forms/login-form.vue'
import RegisterPromoCard from '../components/register-promo-card.vue'
</script>

<style lang="sass" scoped>
.login-view__promo-card
  margin-top: 1.5rem
</style>
