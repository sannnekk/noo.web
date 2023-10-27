<template>
  <div
    class="v-button"
    :class="{ inline, [alignment]: true }"
  >
    <component
      :is="to ? 'router-link' : 'button'"
      :to="to"
      class="v-button__button"
      :class="{ [design]: true, loading, contrast }"
      :disabled="disabled"
      :type="type"
      @click="$emit('click')"
    >
      <loader-icon
        v-if="loading"
        class="v-button__button__loader"
      />
      <slot />
    </component>
  </div>
</template>

<script setup lang="ts">
interface Props {
  alignment?: 'left' | 'center' | 'right' | 'stretch'
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  design?: 'primary' | 'secondary'
  contrast?: boolean
  inline?: boolean
  loading?: boolean
  to?: string
}

interface Emits {
  (e: 'click'): void
}

withDefaults(defineProps<Props>(), {
  design: 'primary',
  type: 'button',
  alignment: 'left'
})

defineEmits<Emits>()
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
      justify-content: center

  &__button
    text-decoration: none
    display: inline-flex
    text-decoration: none
    align-items: center
    border-radius: 3em
    font-family: Montserrat, sans-serif
    font-weight: 400
    cursor: pointer
    padding: 0.5em 1.5em
    font-size: inherit
    transition: 0.2s ease all

    &__loader
      display: block
      font-size: 20px

    &.primary
      color: var(--dark)
      border: 1px solid transparent
      background-color: var(--primary)

      &.contrast
        background-color: var(--dark)
        color: var(--light)

        &:not(.loading):hover
          background-color: var(--light)
          color: var(--dark)

      &:not(.loading):hover
        border-color: var(--dark)

    &.secondary
      color: var(--dark)
      border: 1px solid var(--dark)
      background-color: var(--light-background-color)

      &:not(.loading):hover
        background-color: var(--dark)
        color: var(--light-background-color)
</style>
