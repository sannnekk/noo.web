<template>
  <span
    class="status-tag"
    :class="type"
  >
    <slot />
  </span>
</template>

<script setup lang="ts">
interface Props {
  type?: 'success' | 'warning' | 'danger' | 'info'
}

withDefaults(defineProps<Props>(), {
  type: 'info'
})
</script>

<style scoped lang="sass">
.status-tag
  display: inline-block
  line-height: 1
  white-space: nowrap
  vertical-align: baseline
  user-select: none
  font-weight: normal

  &.success
    color: var(--success)

  &.warning
    color: var(--warning)

  &.danger
    color: var(--danger)

  &.info
    color: var(--text-light)
</style>
