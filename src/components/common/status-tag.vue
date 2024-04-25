<template>
  <b
    class="status-tag"
    :class="[type, mode]"
  >
    <slot />
  </b>
</template>

<script setup lang="ts">
interface Props {
  type?: 'success' | 'warning' | 'danger' | 'info'
  mode?: 'default' | 'background'
}

withDefaults(defineProps<Props>(), {
  type: 'info',
  mode: 'default'
})
</script>

<style scoped lang="sass">
.status-tag
  display: block
  line-height: 1
  white-space: nowrap
  vertical-align: baseline
  user-select: none
  font-weight: normal

  &.background
    padding: 0.3em 1em
    border-radius: var(--border-radius)
    color: var(--form-text-color) !important
    font-weight: 500

    &.success
      background: var(--success)

    &.warning
      background: var(--warning)

    &.danger
      background: var(--danger)
      color: var(--white) !important

    &.info
      background: var(--dark)
      color: var(--white) !important

  &.success
    color: var(--success)

  &.warning
    color: var(--warning)

  &.danger
    color: var(--danger)

  &.info
    color: var(--text-light)
</style>
