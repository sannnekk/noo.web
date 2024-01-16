<template>
  <div
    class="auth-titles"
    v-auto-animate
  >
    <div
      class="auth-titles__image"
      :class="
        mode === 'login'
          ? 'auth-titles__image--login'
          : 'auth-titles__image--register'
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
  mode: 'login' | 'register'
}

const props = defineProps<Props>()

const title = computed(() => {
  if (props.mode === 'login') {
    return 'Вход в систему'
  }

  return 'Регистрация'
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

    &--register
      width: 20%
      margin-bottom: 0.5em
      margin-top: 0

  &__title
    margin-bottom: 1em
    text-align: center
</style>
