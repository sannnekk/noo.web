<template>
  <button class="logout-button">
    <span
      class="logout-button__text"
      @click.prevent="Core.Services.Auth.logout()"
    >
      Выйти
    </span>
  </button>
</template>

<script setup lang="ts">
import { Core } from '@/core/Core'
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
