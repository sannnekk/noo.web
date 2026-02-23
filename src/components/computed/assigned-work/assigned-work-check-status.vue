<template>
  <div
    class="assigned-work-solve-status"
    :class="{
      'assigned-work-solve-status--not-checked': props.status === 'not-checked',
      'assigned-work-solve-status--in-progress': props.status === 'in-progress',
      'assigned-work-solve-status--checked-in-deadline':
        props.status === 'checked-in-deadline',
      'assigned-work-solve-status--checked-after-deadline':
        props.status === 'checked-after-deadline',
      'assigned-work-solve-status--checked-automatically':
        props.status === 'checked-automatically'
    }"
  >
    <span class="assigned-work-solve-solve-status__text">
      {{ statusText }}
    </span>
  </div>
</template>

<script lang="ts" setup>
import type { AssignedWork } from '@/core/data/entities/AssignedWork'
import { computed } from 'vue'

interface Props {
  status: AssignedWork['checkStatus']
}

const props = defineProps<Props>()

const statusText = computed(() => {
  switch (props.status) {
    case 'not-checked':
      return 'Не проверено'
    case 'in-progress':
      return 'В процессе'
    case 'checked-in-deadline':
      return 'Проверено в дедлайн'
    case 'checked-after-deadline':
      return 'Проверено после дедлайна'
    case 'checked-automatically':
      return 'Проверено автоматически'
    default:
      return 'неизвестно'
  }
})
</script>

<style lang="sass" scoped>
.assigned-work-solve-status
  font-weight: bold

  &--not-checked
    color: var(--text-light)

  &--in-progress
    color: var(--warning)

  &--checked-in-deadline
    color: var(--success)

  &--checked-after-deadline
    color: var(--danger)

  &--checked-automatically
    color: var(--success)
</style>
