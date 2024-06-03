<template>
  <component :is="icon" />
</template>

<script setup lang="ts">
import { shallowRef } from 'vue'

interface Props {
  name: string
}

const props = defineProps<Props>()

const icon = shallowRef('div')

import(`./icons/text-format-icons/${props.name}-icon.vue`)
  .then((module) => {
    icon.value = module.default
  })
  .catch(() => {
    icon.value = 'div'
  })
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
