<template>
  <div class="file-form">
    <form-input
      type="number"
      v-model="model.minRating"
      label="Мин. рейтинг"
    />
    <form-input
      type="number"
      v-model="model.maxRating"
      label="Макс. рейтинг"
    />
    <form-checkbox
      style="margin-top: 1em"
      v-model="model.onlyIntegerRating"
      label="Только целые числа"
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
