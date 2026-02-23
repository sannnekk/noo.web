<template>
  <select-input
    :label="label"
    :options="notificationTypeOptions"
    v-model="notificationTypeModel"
  />
</template>

<script setup lang="ts">
import type { Notification } from '@/core/data/entities/Notification'
import { computed } from 'vue'

interface Props {
  label: string
  modelValue: Notification['type']
}

interface Emits {
  (event: 'update:modelValue', value: Notification['type']): void
}

const props = defineProps<Props>()
const emits = defineEmits<Emits>()

const notificationTypeModel = computed<Notification['type']>({
  get: () => props.modelValue,
  set: (value) => emits('update:modelValue', value)
})

const notificationTypeOptions: {
  value: Notification['type']
  label: string
}[] = [
  { value: 'other', label: 'Другое' },
  { value: 'announcement', label: 'Объявление' },
  { value: 'maintenance', label: 'Технические работы' },
  { value: 'new-feature', label: 'Новая функция' }
]
</script>
