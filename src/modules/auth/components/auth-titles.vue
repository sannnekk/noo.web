<template>
  <div
    class="auth-titles"
    v-auto-animate
  >
    <div
      class="auth-titles__image"
      :class="
        mode === 'register'
          ? 'auth-titles__image--register'
          : 'auth-titles__image--login'
      "
    >
      <round-logo />
    </div>
    <h1 class="auth-titles__title">
      {{ title }}
    </h1>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  mode: 'login' | 'register' | 'forgot-password' | 'resend-verification'
}

const props = defineProps<Props>()

const title = computed(() => {
  if (props.mode === 'login') {
    return 'Вход в систему'
  } else if (props.mode === 'register') {
    return 'Регистрация'
  } else if (props.mode === 'forgot-password') {
    return 'Восстановление пароля'
  }

  return 'Подтверждение почты'
})
</script>

<style lang="sass" scoped>
.auth-titles
  &__image
    margin-bottom: 2.5em
    text-align: center
    margin-top: 3em
    width: 45%
    margin: 17% auto
    transition: all 0.3s ease-in-out

    @media screen and (max-width: 768px)
      display: none

    &--register
      width: 20%
      margin-bottom: 0.5em
      margin-top: 0

  &__title
    margin-bottom: 1em
    text-align: center
</style>
