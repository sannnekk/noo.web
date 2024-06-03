<template>
  <div
    class="poll-question"
    v-auto-animate
  >
    <span
      class="poll-question__edit-button"
      v-if="
        readonly &&
        (Core.Context.User?.role === 'teacher' ||
          Core.Context.User?.role === 'admin')
      "
      @click="$emit('edit')"
    >
      Редактировать
    </span>
    <div class="poll-question__title">
      <h3>
        <span
          class="poll-question__title__index"
          v-if="index"
        >
          {{ index + 1 }}.
        </span>
        {{ question.text }}
        <span
          class="poll-question__title__optional"
          v-if="!question.required"
        >
          Необязательно
        </span>
      </h3>
    </div>
    <div
      class="poll-question__description"
      v-if="question.description"
    >
      <p>{{ question.description }}</p>
    </div>
    <div
      class="poll-question__form"
      v-if="questionComponent && model"
    >
      <component
        :is="questionComponent"
        :question="question"
        :readonly="readonly"
        v-model:answer="model"
      />
    </div>
    <div
      class="poll-question__form--loading"
      v-else
    >
      <loader-icon contrast />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Core } from '@/core/Core'
import type { PollAnswer } from '@/core/data/entities/PollAnswer'
import type { PollQuestion } from '@/core/data/entities/PollQuestion'
import { computed, shallowRef, watchEffect } from 'vue'

interface Props {
  question: PollQuestion
  index?: number
  answer: PollAnswer
  readonly?: boolean
}

interface Emits {
  (e: 'update:answer', value: PollAnswer): void
  (e: 'edit'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const model = computed({
  get: () => props.answer,
  set: (value) => emit('update:answer', value)
})

const questionComponent = shallowRef<any>(null)

watchEffect(() => {
  switch (props.question.type) {
    case 'date':
      import('./poll-question-types/poll-question-date.vue').then(
        (c) => (questionComponent.value = c.default)
      )
      break
    case 'number':
      import('./poll-question-types/poll-question-number.vue').then(
        (c) => (questionComponent.value = c.default)
      )
      break
    case 'choice':
      import('./poll-question-types/poll-question-choice.vue').then(
        (c) => (questionComponent.value = c.default)
      )
      break
    case 'rating':
      import('./poll-question-types/poll-question-rating.vue').then(
        (c) => (questionComponent.value = c.default)
      )
      break
    case 'file':
      import('./poll-question-types/poll-question-file.vue').then(
        (c) => (questionComponent.value = c.default)
      )
      break
    case 'text':
    default:
      import('./poll-question-types/poll-question-text.vue').then(
        (c) => (questionComponent.value = c.default)
      )
      break
  }
})
</script>

<style scoped lang="sass">
.poll-question
  padding: 1em
  //box-shadow: 0 0 10px rgba(0, 0, 0, 0.1)
  border-radius: var(--border-radius)

  &__edit-button
    margin-right: 0.5em
    font-size: 0.8em
    color: var(--dark)
    background: var(--warning)
    padding: 0.2em 1em
    border-radius: var(--border-radius)
    cursor: pointer
    font-weight: normal
    border: 1px solid var(--warning)

    &:hover
      background: var(--form-background)
      color: var(--form-text-color)

  &__title
    margin-bottom: 0.5em

    &__index
      margin-right: 0.2em
      font-size: 1.2em
      color: var(--secondary)

    &__optional
      margin-left: 0.5em
      font-size: 0.8em
      color: var(--text-light)
      font-weight: lighter
      font-style: italic

    h3
      margin: 0

  &__description
    margin-bottom: 0.5em
    color: var(--text-light)

  &__form
    margin-bottom: 0.5em

    &--loading
      display: flex
      justify-content: center
      align-items: center
      height: 100px
      font-size: 40px
</style>
