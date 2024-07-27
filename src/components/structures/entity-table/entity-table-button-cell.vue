<template>
  <common-button
    :alignment="alignment"
    :design="design"
    :is-loading="isLoading"
    @click="$emit('action')"
  >
    {{ value }}
  </common-button>
</template>

<script setup lang="ts">
interface Props {
  value?: string
  design?: 'primary' | 'secondary' | 'inline' | 'telegram'
  alignment?: 'left' | 'center' | 'right'
  isLoading?: boolean
}

interface Emits {
  (event: 'action'): void
}

defineProps<Props>()
defineEmits<Emits>()
</script>

<style lang="sass" scoped>
div
  width: 100%
  font-size: 0.75em
</style>
