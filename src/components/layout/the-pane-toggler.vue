<template>
  <button
    class="pane-toggler"
    @click="globalStore.setPaneOpen(true)"
  >
    <inline-icon name="bars" />
  </button>
</template>

<script setup lang="ts">
import { useGlobalStore } from '@/store'

const globalStore = useGlobalStore()
</script>

<style scoped lang="sass">
.pane-toggler
  border: none
  background: none
  padding: 0.2em
  color: var(--dark)
  font-size: 1em
  cursor: pointer

  &:hover
    color: var(--text-light)
</style>
