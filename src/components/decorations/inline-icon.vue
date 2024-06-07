<template>
  <component
    :is="icon"
    class="icon"
    :class="{ animation }"
  />
</template>

<script setup lang="ts">
import { shallowRef } from 'vue'

interface Props {
  name:
    | 'bars'
    | 'home'
    | 'uni-cap'
    | 'list'
    | 'calender'
    | 'user'
    | 'check-green'
    | 'check-red'
    | 'cross-red'
    | 'question-yellow'
    | 'attention-yellow'
    | 'minus-yellow'
    | 'check-red'
    | 'jpg-file'
    | 'png-file'
    | 'pdf-file'
    | 'telegram'
    | 'info'
    | 'delete'
    | 'moon'
    | 'sun'
    | 'search'
  animation?: boolean
}

const props = defineProps<Props>()

let icon = shallowRef('div')

import(`./icons/${props.name}-icon.vue`)
  .then((module) => {
    icon.value = module.default
  })
  .catch(() => {
    icon.value = 'div'
  })
</script>

<style lang="sass" scoped>
.icon
  height: 1em
  width: 1em
  transition: all 0.1s ease-in-out

  &:deep()
    .moveable-forwards,
    .moveable-backwards
      transition: all 0.1s ease-in-out

  &.animation:deep()
    .moveable-forwards
      transform: translate(7%, 7%)
    .moveable-backwards
      transform: translate(-7%, -7%)
</style>
