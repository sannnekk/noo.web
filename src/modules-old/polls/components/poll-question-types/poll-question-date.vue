<template>
  <div class="poll-question-date">
    <!-- TODO: filter only future/past dates -->
    <form-input
      label="Выберите дату"
      type="date"
      v-model="model.date"
      :readonly="readonly"
    />
  </div>
</template>

<script setup lang="ts">
import type { PollAnswer } from '@/core/data/entities/PollAnswer'
import type { PollQuestion } from '@/core/data/entities/PollQuestion'
import { computed } from 'vue'

interface Props {
  question: PollQuestion
  answer: PollAnswer
  readonly?: boolean
}

interface Emits {
  (e: 'update:answer', value: PollAnswer): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const model = computed({
  get: () => props.answer,
  set: (value) => emit('update:answer', value)
})
</script>

<style scoped lang="sass"></style>
