<template>
  <div class="answer-list">
    <div class="answer-list__head">
      <h2>Ответы</h2>
    </div>
    <div class="answer-list__list">
      <div
        class="answer-list__list__item"
        v-for="(question, index) in props.questions"
        :key="question.id"
      >
        <poll-question
          v-if="answer(question.id)"
          readonly
          :question="question"
          :answer="answer(question.id)"
          :index="index"
          @edit="emits('edit', answer(question.id).id)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import pollQuestion from './poll-question.vue'
import type { PollAnswer } from '@/core/data/entities/PollAnswer'
import type { PollQuestion } from '@/core/data/entities/PollQuestion'

interface Props {
  questions: PollQuestion[]
  answers: PollAnswer[]
}

interface Emits {
  (e: 'edit', answerId: PollAnswer['id']): void
}

const props = defineProps<Props>()
const emits = defineEmits<Emits>()

function answer(questionId: PollQuestion['id']): PollAnswer {
  return props.answers.find((a) => a.questionId === questionId)!
}
</script>

<style scoped lang="sass">
.answer-list
  &__head
    margin-left: 0.6em
</style>
