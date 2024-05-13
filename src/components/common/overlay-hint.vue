<template>
  <div
    v-if="visible"
    class="overlay-hint"
    :style="{
      top: position.y + 'px',
      left: position.x - 20 + 'px',
      position: absolute ? 'absolute' : 'fixed'
    }"
  >
    <div class="overlay-hint__content">
      <span
        class="overlay-hint__content__close"
        @click="hideHint()"
      >
        +
      </span>
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  position: { x: number; y: number }
  visible: boolean
  absolute?: boolean
}

interface Emits {
  (event: 'update:visible', value: boolean): void
}

const props = defineProps<Props>()
const emits = defineEmits<Emits>()

function hideHint() {
  emits('update:visible', false)
}
</script>

<style scoped lang="sass">
.overlay-hint
  z-index: 1000
  max-width: min(500px, 100%)
  padding: 10px

  &__content
    background-color: var(--lightest)
    border-radius: var(--border-radius)
    padding: 0.8em
    box-shadow: 0px 0px 15px #00000055
    border-radius: var(--border-radius)

    &::before
      content: ''
      position: absolute
      width: 0
      height: 0
      border-left: 10px solid transparent
      border-right: 10px solid transparent
      border-bottom: 10px solid var(--lightest)
      top: 0px
      left: 28px

    &__close
      cursor: pointer
      font-size: 2em
      margin-right: 0.5em
      transition: transform 0.2s
      transform: rotate(45deg)
      position: absolute
      top: 5px
      right: 5px
      color: var(--lila)

      &:hover
        color: var(--text-light)
</style>
