<template>
  <div class="file-form">
    <form-input
      type="number"
      v-model="model.minLength"
      label="Мин. длина"
    />
    <form-input
      type="number"
      v-model="model.maxLength"
      label="Макс. длина"
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
</script>
