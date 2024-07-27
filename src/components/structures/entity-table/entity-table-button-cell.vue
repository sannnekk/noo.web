<template>
  <common-button
    :alignment="alignment"
    :design="design"
    @click="action"
  >
    {{ value }}
  </common-button>
</template>

<script setup lang="ts">
interface Props {
  value?: string
  design?: 'primary' | 'secondary' | 'inline' | 'telegram'
  alignment?: 'left' | 'center' | 'right'
  action: (value: any) => void
}

defineProps<Props>()
</script>

<style lang="sass" scoped>
div
  width: 100%
  font-size: 0.75em
</style>
