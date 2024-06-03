<template>
  <div
    class="poll-question-choice"
    v-if="model"
  >
    <check-list
      v-model="model.choices"
      :items="options"
      item-label-key="name"
      item-key="name"
      :multiple="question.maxChoices !== 1"
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
  set: (value) => {
    if (value.choices!.length > (props.question.maxChoices || 1)) {
      value.choices = value.choices!.slice(0, props.question.maxChoices)
    }

    emit('update:answer', value)
  }
})

const options = computed(() => {
  return (props.question.choices || []).map((choice) => ({
    name: choice
  }))
})
</script>

<style scoped lang="sass">
.poll-question-choice
  padding-top: 0.5em
</style>
