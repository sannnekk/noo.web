<template>
  {{ value ? useDate(value, { precision: 'day' }).toBeautiful() : '-' }}
</template>

<script setup lang="ts">
import { useDate } from '@/composables/useDate'

interface Props {
  value?: Date
}

defineProps<Props>()
</script>
