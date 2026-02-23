<template>
  <span
    class="pane-toggler"
    @click="Core.Services.UI.setPaneOpen(true)"
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
import { Core } from '@/core/Core'
import { ref } from 'vue'

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
