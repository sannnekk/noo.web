<template>
  <component
    :is="`${name}-icon`"
    class="icon"
    :class="{ animation }"
  />
</template>

<script setup lang="ts">
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
    | 'cros-red'
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
  animation?: boolean
}

defineProps<Props>()
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
