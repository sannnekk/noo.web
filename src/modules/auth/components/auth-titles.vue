<template>
  <div
    class="auth-titles"
    v-auto-animate
  >
    <div
      class="auth-titles__logo"
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
    <img
      class="auth-titles__image"
      src="/login-heads-4.png"
      v-if="mode === 'register'"
    />
    <p
      class="auth-titles__hint"
      v-if="false"
    >
      <b>Зарегистрируйся</b> и получи курс по заданиям №1 и №22 ЕГЭ по биологии
      – прибавь <b>~10 баллов</b> к результату!
    </p>
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
  &__logo
    margin-bottom: 0.5em
    text-align: center
    margin-top: 0em
    width: 30%
    margin: 17% auto 0.5em auto
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

  &__image
    width: 100%
    margin-left: 0
    margin-top: 0
    margin-bottom: 2em

  &__hint
    text-align: center
    font-size: 0.9em
    color: #333
    margin-bottom: 2em
</style>
