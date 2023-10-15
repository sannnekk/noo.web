<template>
  <button class="logout-button">
    <inline-icon
      name="logout"
      class="logout-button__icon"
    />
    <span
      class="logout-button__text"
      @click.prevent="userStore.logout()"
    >
      Выйти
    </span>
  </button>
</template>

<script setup lang="ts">
import { useUserStore } from '@/store'

const userStore = useUserStore()
</script>

<style scoped lang="sass">
.logout-button
  border: none
  background: none
  color: var(--danger)
  cursor: pointer
  font-size: 1em

  &__icon
    margin-right: 0.4em

  &:hover
    opacity: 0.7
</style>
