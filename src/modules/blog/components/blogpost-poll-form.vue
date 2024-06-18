<template>
  <div class="blogpost-poll-form">
    <warning-block>
      Опрос нельзя изменить после публикации поста, будьте внимательны!
    </warning-block>
    <br />
    <div class="blogpost-poll-form__info">
      <div class="row">
        <div class="col-md-6">
          <label class="blogpost-poll-form__info__label">
            Кто может пройти опрос
          </label>
          <check-list
            :items="visibilityOptions"
            item-label-key="label"
            item-key="role"
            multiple
            v-model="model.canVote"
          />
        </div>
        <div class="col-md-6">
          <label class="blogpost-poll-form__info__label">
            Кто может видеть результаты
          </label>
          <check-list
            :items="visibilityOptions"
            item-label-key="label"
            item-key="role"
            multiple
            v-model="model.canSeeResults"
          />
        </div>
      </div>
      <div class="row">
        <div class="col-md-6">
          <form-input
            type="text"
            v-model="model.title"
            label="Название опроса"
          />
        </div>
        <div class="col-md-3 only-for-registered">
          <form-checkbox
            label="Только для зарегистрированных"
            v-model="model.requireAuth"
          />
        </div>
        <div class="col-md-3">
          <form-input
            type="date"
            v-model="model.stopAt"
            label="Дата окончания"
          />
        </div>
      </div>
      <text-area
        label="Описание"
        v-model="model.description"
      />
    </div>
    <div
      class="blogpost-poll-form__questions"
      v-auto-animate
    >
      <div
        class="blogpost-poll-form__question"
        v-for="(question, index) in model.questions"
        :key="question.id"
      >
        <blogpost-poll-form-question
          :index="index"
          :modelValue="question"
          @update:modelValue="model.questions[index] = $event"
          @remove="removeQuestion(index)"
        />
      </div>
      <div
        class="blogpost-poll-form__questions__add-question"
        @click="addQuestion()"
      >
        <div class="blogpost-poll-form__questions__add-question__inner">
          <span class="blogpost-poll-form__questions__add-question__icon">
            +
          </span>
          <span class="blogpost-poll-form__questions__add-question__label">
            Добавить вопрос
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import BlogpostPollFormQuestion from './blogpost-poll-form-question.vue'
import type { Poll } from '@/core/data/entities/Poll'
import type { PollQuestion } from '@/core/data/entities/PollQuestion'
import { computed } from 'vue'

interface Props {
  modelValue: Poll
}

interface Emits {
  (event: 'update:modelValue', value: Poll): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const model = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const visibilityOptions = [
  { label: 'Преподаватели', role: 'teacher' },
  { label: 'Ученики', role: 'student' },
  { label: 'Кураторы', role: 'mentor' },
  { label: 'Все', role: 'everyone' }
]

function addQuestion() {
  model.value.questions.push(emptyQuestion())
}

function removeQuestion(index: number) {
  model.value.questions.splice(index, 1)
}

function emptyQuestion(): PollQuestion {
  return {
    id: undefined as any,
    answers: undefined as any,
    text: '',
    description: '',
    type: 'text',
    required: false,

    // choice
    choices: [],
    minChoices: 1,
    maxChoices: 2,

    // rating
    minRating: 0,
    maxRating: 5,
    onlyIntegerRating: true,

    // file
    maxFileSize: 5,
    maxFileCount: 1,
    allowedFileTypes: ['image/jpeg', 'image/png'],

    // text
    minLength: 1,
    maxLength: 100,

    // number
    minValue: 0,
    maxValue: 100,
    onlyIntegerValue: true,

    // date
    onlyFutureDate: false,
    onlyPastDate: false
  }
}
</script>

<style lang="sass" scoped>
.blogpost-poll-form
  &__info
    margin-bottom: 1em

    .only-for-registered
      margin-top: 1.3em

    &__label
      font-size: 0.8rem
      color: var(--text-light)
      margin-bottom: 0.9em
      display: inline-block

  &__questions
    margin-bottom: 1em
    display: flex
    overflow-y: auto
    gap: 1em
    padding: 0.5em 0

    &__add-question
      min-width: 300px
      display: flex
      flex-direction: column
      align-items: center
      justify-content: center
      cursor: pointer

      &__inner
        display: flex
        flex-direction: column
        align-items: center
        justify-content: center
        padding: 3em 1em
        border: 1px dashed var(--border-color)
        border-radius: var(--border-radius)
        width: 80%

        &:hover
          background-color: var(--border-color)

      &__icon
        font-size: 100px
        line-height: 70px

      &__label
        margin-top: 1em
        font-weight: bold
</style>
