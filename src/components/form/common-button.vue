<template>
  <div
    class="v-button"
    :class="{ inline, [alignment]: true }"
  >
    <button
      class="v-button__button"
      :class="{ [design]: true, contrast }"
      :disabled="disabled"
      :type="type"
      @click="$emit('click')"
    >
      <loader-icon
        v-if="loading"
        class="v-button__button__loader"
      />
      <slot />
    </button>
  </div>
  <loader-overlay v-if="overlay" />
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

interface Props {
  alignment?: 'left' | 'center' | 'right' | 'stretch'
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  design?: 'primary' | 'secondary'
  contrast?: boolean
  inline?: boolean
  loading?: boolean
}

interface Emits {
  (e: 'click'): void
}

const props = withDefaults(defineProps<Props>(), {
  design: 'primary',
  type: 'button',
  alignment: 'left'
})
const emits = defineEmits<Emits>()

const overlay = ref(false)

watch(
  () => props.loading,
  () => {
    setTimeout(() => (overlay.value = true), 500)
    setTimeout(() => (overlay.value = false), 2000)
  }
)
</script>

<style scoped lang="sass">
.v-button
  width: 100%
  display: flex
  flex-direction: row

  &.inline
    display: inline-flex

  &.left
    justify-content: flex-start

  &.center
    justify-content: center

  &.right
    justify-content: flex-end

  &.stretch
    .v-button__button
      width: 100%

  &__button
    display: inline-flex
    align-items: center
    border-radius: 3em
    font-family: Montserrat, sans-serif
    font-weight: 400
    text-transform: uppercase
    cursor: pointer
    padding: 0.5em 2.5em

    &__loader
      display: block
      font-size: 40px

    &.primary
      color: var(--dark)
      border: 1px solid var(--dark)
      background-color: var(--primary)

      &.contrast
        background-color: var(--dark)
        color: var(--light)

        &:hover
          background-color: var(--light)
          color: var(--dark)

      &:hover
        background-color: var(--light-background-color)

    &.secondary
      color: var(--dark)
      border: 1px solid var(--dark)
      background-color: var(--light-background-color)

      &:hover
        background-color: var(--dark)
        color: var(--light-background-color)
</style>
