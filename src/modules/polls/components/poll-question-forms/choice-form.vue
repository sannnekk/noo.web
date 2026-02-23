<template>
  <div class="file-form">
    <tag-input
      v-model="model.choices"
      label="Варианты ответа"
    />
    <form-input
      type="number"
      v-model="model.minChoices"
      label="Мин. количество ответов"
    />
    <form-input
      type="number"
      v-model="model.maxChoices"
      label="Макс. количество ответов"
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
