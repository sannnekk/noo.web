<template>
  <div
    class="assigned-work-solve-status"
    :class="{
      'assigned-work-solve-status--not-started': props.status === 'not-started',
      'assigned-work-solve-status--in-progress': props.status === 'in-progress',
      'assigned-work-solve-status--made-in-deadline':
        props.status === 'made-in-deadline',
      'assigned-work-solve-status--made-after-deadline':
        props.status === 'made-after-deadline'
    }"
  >
    <span class="assigned-work-solve-solve-status__text">
      {{ statusText }}
    </span>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

interface Props {
  status: string
}

const props = defineProps<Props>()

const statusText = computed(() => {
  switch (props.status) {
    case 'not-started':
      return 'Не начато'
    case 'in-progress':
      return 'В процессе'
    case 'made-in-deadline':
      return 'Сдано в дедлайн'
    case 'made-after-deadline':
      return 'Сдано после дедлайна'
    default:
      return 'неизвестно'
  }
})
</script>

<style lang="sass" scoped>
.assigned-work-solve-status
  font-weight: bold

  &--not-started
    color: var(--text-light)

  &--in-progress
    color: var(--warning)

  &--made-in-deadline
    color: var(--success)

  &--made-after-deadline
    color: var(--danger)
</style>
