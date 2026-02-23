<template>
  <div class="file-form">
    <select-input
      v-model="model.allowedFileTypes as any"
      :options="fileTypeOptions"
      label="Тип файлов"
    />
    <form-input
      type="number"
      v-model="model.maxFileCount"
      label="Макс. количество файлов"
    />
    <form-input
      type="number"
      v-model="model.maxFileSize"
      label="Макс. размер файлов (в МБ, не более 80 МБ)"
    />
  </div>
</template>

<script lang="ts" setup>
import type { PollQuestion } from '@/core/data/entities/PollQuestion'
import { computed } from 'vue'

interface Props {
  modelValue: PollQuestion
}

interface Emits {
  (event: 'update:modelValue', value: PollQuestion): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const model = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const fileTypeOptions = [
  { label: 'Изображение', value: ['image/jpeg', 'image/png'] },
  { label: 'PDF', value: ['application/pdf'] }
] as {
  label: string
  value: any
}[]
</script>
