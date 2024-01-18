<template>
  <span
    class="pane-toggler"
    @click="globalStore.setPaneOpen(true)"
    @mouseenter="isOnHover = true"
    @mouseleave="isOnHover = false"
  >
    <inline-icon
      name="bars"
      :animation="isOnHover"
    />
  </span>
</template>

<script setup lang="ts">
import { useGlobalStore } from '@/store'
import { ref } from 'vue'

const globalStore = useGlobalStore()

const isOnHover = ref(false)
</script>

<style scoped lang="sass">
.pane-toggler
  border: none
  background: none
  color: var(--dark)
  font-size: 1em
  display: flex
  align-items: center
  justify-content: center
  cursor: pointer
  height: 1em
  width: 1em
</style>
