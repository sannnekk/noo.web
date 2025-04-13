<template>
  <div
    class="warning-block"
    :class="{ 'warning-block--small': small }"
  >
    <div class="warning-block__icon">
      <inline-icon name="attention-yellow" />
    </div>
    <div class="warning-block__text">
      <slot />
    </div>
  </div>
</template>

<script lang="ts" setup>
interface Props {
  small?: boolean
}

defineProps<Props>()
</script>

<style scoped lang="sass">
.warning-block
  display: flex
  align-items: center
  padding: 1em
  border-radius: var(--border-radius)
  background-color: var(--lightest)
  color: var(--warning)
  border: 1px solid var(--warning)

  &--small
    padding: 0.5em
    font-size: 0.8em

  &__icon
    font-size: 40px
    line-height: 10px

  &__text
    padding-left: 1em
</style>
