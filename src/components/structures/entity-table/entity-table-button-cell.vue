<template>
  <common-button
    v-if="value"
    :alignment="alignment"
    :design="design"
    :is-loading="isLoading"
    :to="linkTo"
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
  linkTo?: string
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
