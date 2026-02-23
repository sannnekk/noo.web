<template>
  <div class="create-poll-view">
    <div class="create-poll-view__info">
      <div class="row create-poll-view__info__main-info-row">
        <div class="col-md-6">
          <form-input
            type="text"
            v-model="createPollStore.poll.title"
            label="Название опроса"
            :validators="[
              ($v: any) => !!$v || 'Введите название опроса',
              ($v: any) => $v.length <= 150 || 'Максимальная длина 150 символов'
            ]"
          />
        </div>
        <div class="col-md-3 only-for-registered">
          <form-checkbox
            label="Только для зарегистрированных"
            v-model="createPollStore.poll.requireAuth"
          />
        </div>
        <div class="col-md-3">
          <form-input
            type="date"
            v-model="createPollStore.poll.stopAt"
            label="Дата окончания"
          />
        </div>
      </div>
      <div class="row">
        <div class="col-md-6">
          <label class="create-poll-view__info__label">
            Кто может пройти опрос
          </label>
          <check-list
            :items="visibilityOptions"
            item-label-key="label"
            item-key="role"
            multiple
            v-model="createPollStore.poll.canVote"
          />
        </div>
        <div class="col-md-6">
          <label class="create-poll-view__info__label">
            Кто может видеть результаты
          </label>
          <check-list
            :items="visibilityOptions"
            item-label-key="label"
            item-key="role"
            multiple
            v-model="createPollStore.poll.canSeeResults"
          />
        </div>
      </div>
      <text-area
        label="Описание"
        v-model="createPollStore.poll.description"
        :validators="[
          ($v: any) => $v.length > 500 || 'Максимальная длина 500 символов'
        ]"
      />
      <info-block>
        После создания опроса нельзя изменить типы вопросов
      </info-block>
    </div>
    <div
      class="create-poll-view__questions"
      v-auto-animate
    >
      <div
        class="create-poll-view__question"
        v-for="(question, index) in createPollStore.poll.questions"
        :key="question.id"
      >
        <create-poll-form-question
          :index="index"
          :modelValue="question"
          :changeable-type="!createPollStore.poll.id"
          @update:modelValue="createPollStore.poll.questions[index] = $event"
          @remove="removeQuestion(index)"
        />
      </div>
      <div
        class="create-poll-view__questions__add-question"
        @click="addQuestion()"
      >
        <div class="create-poll-view__questions__add-question__inner">
          <span class="create-poll-view__questions__add-question__icon">
            +
          </span>
          <span class="create-poll-view__questions__add-question__label">
            Добавить вопрос
          </span>
        </div>
      </div>
    </div>
    <div class="create-poll-view__actions">
      <common-button
        @click="createPollStore.savePoll()"
        alignment="right"
      >
        Сохранить
      </common-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import CreatePollFormQuestion from '../components/create-poll-form-question.vue'
import type { PollQuestion } from '@/core/data/entities/PollQuestion'
import { watch } from 'vue'
import { useCreatePollStore } from '../stores/create-poll'
import { useRoute } from 'vue-router'

const createPollStore = useCreatePollStore()
const route = useRoute()

watch(
  () => route.params.pollId,
  () => {
    if (route.params.pollId) {
      createPollStore.fetchPoll(route.params.pollId as string)
    }
  },
  { immediate: true }
)

const visibilityOptions = [
  { label: 'Преподаватели', role: 'teacher' },
  { label: 'Ученики', role: 'student' },
  { label: 'Кураторы', role: 'mentor' },
  { label: 'Все', role: 'everyone' }
]

function addQuestion() {
  createPollStore.poll.questions.push(emptyQuestion())
}

function removeQuestion(index: number) {
  createPollStore.poll.questions.splice(index, 1)
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

watch(
  () => createPollStore.poll.canVote,
  () => {
    const canVote = createPollStore.poll.canVote

    if (canVote[canVote.length - 1] === 'everyone' && canVote.length > 1) {
      createPollStore.poll.canVote = ['everyone']
    } else if (canVote[0] === 'everyone' && canVote.length > 1) {
      createPollStore.poll.canVote = canVote.filter((v) => v !== 'everyone')
    }
  }
)

watch(
  () => createPollStore.poll.canSeeResults,
  () => {
    const canSeeResults = createPollStore.poll.canSeeResults

    if (
      canSeeResults[canSeeResults.length - 1] === 'everyone' &&
      canSeeResults.length > 1
    ) {
      createPollStore.poll.canSeeResults = ['everyone']
    } else if (canSeeResults[0] === 'everyone' && canSeeResults.length > 1) {
      createPollStore.poll.canSeeResults = canSeeResults.filter(
        (v) => v !== 'everyone'
      )
    }
  }
)
</script>

<style scoped lang="sass">
.create-poll-view
  padding: 1em

  &__info
    margin-bottom: 1em

    &__main-info-row
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
    display: grid
    grid-template-columns: 1fr 1fr
    gap: 1em

    @media (max-width: 768px)
      grid-template-columns: 1fr

    &__add-question
      width: 100%
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

  &__actions
    margin-top: 2em
</style>
