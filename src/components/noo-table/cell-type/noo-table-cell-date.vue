<template>
  <div class="noo-table-cell-date">
    {{ useDate(value, { precision: 'day' }).toBeautiful() }}
  </div>
</template>

<script lang="ts" setup>
import { useDate } from '@/composables/useDate'

interface Props {
  value: Date
}

defineProps<Props>()
</script>
