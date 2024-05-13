<template>
  <component :is="`${name}-icon`" />
</template>

<script setup lang="ts">
interface Props {
  name: string
}

defineProps<Props>()
</script>

<style lang="sass" scoped>
svg
  fill: none
  stroke: none
  height: 1.4em

:deep()
  .ql-fill
    fill: var(--form-text-color)

  .ql-stroke
    stroke: var(--form-text-color)
    stroke-width: 2px
</style>
