<template>
  <div
    class="v-button"
    :class="{ inline, [alignment]: true }"
  >
    <component
      :is="to ? (to.startsWith('http') ? 'a' : 'router-link') : 'button'"
      :to="to"
      :href="to"
      :target="to?.startsWith('http') ? '_blank' : ''"
      class="v-button__button"
      :class="{ [design]: true, loading, contrast }"
      :disabled="disabled"
      :type="type"
      @click="$emit('click')"
    >
      <loader-icon
        v-if="loading"
        class="v-button__button__icon"
      />
      <inline-icon
        v-else-if="design === 'telegram'"
        name="telegram"
        class="v-button__button__icon"
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
  design?:
    | 'primary'
    | 'secondary'
    | 'danger'
    | 'warning'
    | 'telegram'
    | 'inline'
  contrast?: boolean
  inline?: boolean
  loading?: boolean
  to?: string
  color?: `#${string}`
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
  pointer-events: none
  text-align: center

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
    pointer-events: all
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
    color: var(--form-text-color)

    &__icon
      display: block
      font-size: 20px
      margin-right: 0.3em

    &.primary
      border: 1px solid transparent
      background-color: var(--primary)
      color: var(--dark)

      &.contrast
        background-color: var(--dark)
        color: var(--lightest)

        &:not(.loading):hover
          background-color: var(--light)
          color: var(--form-text-color)

      &:not(.loading):hover
        border-color: var(--dark)

    &.inline
      border: none
      cursor: pointer
      display: inline-block

      &:not(.loading):hover
        opacity: 0.8

    &.telegram
      border: 1px solid transparent
      background-color: var(--telegram)
      color: var(--white)

      &:not(.loading):hover
        opacity: 0.8
        color: var(--white)

    &.secondary
      border: 1px solid var(--dark)
      background-color: var(--light)

      &:not(.loading):hover
        background-color: var(--dark)
        color: var(--white) !important

    &.danger
      border: 1px solid transparent
      background-color: var(--danger)
      color: var(--white)

      &:not(.loading):hover
        opacity: 0.8

    &.warning
      border: 1px solid var(--warning)
      background-color: var(--warning)

      &:not(.loading):hover
        background-color: transparent
</style>
