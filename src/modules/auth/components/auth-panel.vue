<template>
  <div class="auth-panel">
    <div class="auth-panel__content">
      <div
        class="auth-panel__logo"
        v-if="logo"
      >
        <round-logo />
      </div>
      <h1 class="auth-panel__title">{{ title }}</h1>
      <slot />
    </div>
    <div class="auth-panel__rights">
      <auth-rights />
    </div>
  </div>
</template>

<script setup lang="ts">
import AuthRights from './auth-rights.vue'

interface Props {
  title: string
  logo?: boolean
}

defineProps<Props>()
</script>

<style lang="sass" scoped>
.auth-panel
  display: flex
  flex-direction: column
  flex: 1
  width: 100%
  max-width: 34rem
  margin: 0 auto

  &__content
    display: flex
    flex-direction: column
    justify-content: center
    flex: 1 0 auto
    padding-bottom: 2rem

  &__logo
    width: clamp(6rem, 30%, 9.5rem)
    margin: 0 auto 1rem

  &__title
    margin: 0 0 1.5rem
    text-align: center
    font-size: clamp(1.5rem, 1rem + 1.6vw, 2.25rem)
    line-height: 1.2

  &__rights
    flex: none
    padding-top: 1.5rem

  // Shared look of the controls inside the green panel. Every form rendered
  // into the panel slot uses `.auth-form` as its root class, so this is the
  // single place where field / button / link sizing lives.
  :deep(.auth-form)
    display: flex
    flex-direction: column
    gap: 1rem

    .text-input
      label
        margin-bottom: 0.35rem
        font-size: 0.95rem

      input
        border-color: var(--border-color)
        padding: 1em 1.5em
        font-size: 1rem

    .v-button__button
      padding: 1em 1.5em
      font-size: 1.05rem
      font-weight: 500

    a
      color: var(--auth-link-color)
</style>
