<template>
  <div class="file-form">
    <form-checkbox
      v-model="model.onlyFutureDate"
      label="Только будущие даты"
    />
    <form-checkbox
      v-model="model.onlyPastDate"
      label="Только прошлые даты"
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

<style lang="sass" scoped>
.file-form
  display: flex
  flex-direction: column
  gap: 0.5em
  padding: 0.5em 0
</style>
