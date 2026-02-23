<template>
  <div class="poll-form">
    <div
      class="poll-form__questions"
      v-auto-animate
    >
      <poll-question
        v-for="(question, index) in questions"
        :key="question.id"
        :question="question"
        :index="index"
        v-model:answer="model[index]"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import pollQuestion from './poll-question.vue'
import type { PollAnswer } from '@/core/data/entities/PollAnswer'
import type { PollQuestion } from '@/core/data/entities/PollQuestion'
import { computed } from 'vue'

interface Props {
  questions: PollQuestion[]
  answers: PollAnswer[]
}

interface Emits {
  (e: 'update:answers', value: PollAnswer[]): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const model = computed({
  get: () => props.answers,
  set: (value) => emit('update:answers', value)
})
</script>

<style scoped lang="sass">
.poll-form
  &__questions
    display: flex
    flex-direction: column
    gap: 2em
</style>
