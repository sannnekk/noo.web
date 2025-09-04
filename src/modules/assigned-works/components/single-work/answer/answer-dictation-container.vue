<template>
  <div
    class="task-answer-container"
    v-auto-animate
    v-if="model || !readonly"
  >
    <h4 class="task-answer-container__title">Ваш диктант:</h4>
    <div class="task-answer-container__answer-box">
      <rich-text-container
        v-if="readonly"
        :content="model!"
        :commentable="commentable"
        :comment-types="commentTypes"
        @commented="onComment($event)"
      />
      <rich-text-area
        v-else
        v-model="model!"
      />
    </div>
    <!-- <div class="task-answer-container__answer-box__word-count">
      <div class="task-answer-container__answer-box__word-count__current">
        <word-counter
          :value="model"
          v-model:word-count="wordCount"
        />
      </div>
      <div class="task-answer-container__answer-box__word-count__min">
        <span>
          Минимум:
          <b :class="{ error: wordCount < 150 }">150</b>
          слов
        </span>
      </div>
      <div class="task-answer-container__answer-box__word-count__max">
        <span>
          Максимум:
          <b :class="{ error: wordCount > 1000 }">1000</b>
          слов
        </span>
      </div>
    </div> -->
  </div>
  <div
    class="task-answer-container__empty"
    v-else
  >
    Нет ответа
  </div>
</template>

<script setup lang="ts">
import type { AssignedWork } from '@/core/data/entities/AssignedWork'
import type { Task } from '@/core/data/entities/Task'
import type { Answer } from '@/core/data/entities/Answer'
import { entityFactory } from '@/core/utils/entityFactory'
import { computed, ref, watch } from 'vue'
import type { DeltaContentType } from '@/types/composed/DeltaContentType'
import { emptyDelta } from '@/core/utils/deltaHelpers'
import type { CriteriaItem } from '@/modules/assigned-works/types/CriteriaItem'

interface Props {
  modelValue: AssignedWork
  taskId: Task['id']
  readonly?: boolean
  commentable?: boolean
}

interface Emits {
  (e: 'update:modelValue', value: AssignedWork): void
}

const props = defineProps<Props>()
const emits = defineEmits<Emits>()

const model = ref<DeltaContentType>(getTextAnswer())
watch(model, insertTextAnswer, { deep: true, immediate: true })

const criteria = ref<CriteriaItem[]>([])
setCriteria()
const commentTypes = computed(() => [
  ...criteria.value.filter((c) => c?.showInComment).map((c) => c.code),
  '...'
])

//const wordCount = ref<number>(0)

function getTextAnswer() {
  const answer = props.modelValue.answers.find(
    (answer) => answer.taskId === props.taskId
  )

  return answer?.content || emptyDelta()
}

function insertTextAnswer(value: DeltaContentType) {
  let answer = props.modelValue.answers.find(
    (answer) => answer.taskId === props.taskId
  )

  if (!answer) {
    answer = entityFactory<Answer>('answer')
    answer.content = emptyDelta()
    answer.word = null
    answer.taskId = props.taskId

    emits('update:modelValue', {
      ...props.modelValue,
      answers: [...props.modelValue.answers, answer]
    })
  } else {
    answer.content = value
    emits('update:modelValue', props.modelValue)
  }
}

function onComment(value: DeltaContentType) {
  model.value = value
}

async function setCriteria() {
  const imported = await import('../criteria/dictation-criteria.json')
  criteria.value = imported.default
}
</script>

<style scoped lang="sass">
.task-answer-container
  &__title
    font-weight: 700
    margin-bottom: 0.5em
    margin-left: 0.3em

  &__empty
    margin-top: 0.7em
    margin-left: 0.3em
    color: var(--text-light)

  &__answer-box
    &__word-count
      display: flex
      flex-direction: row
      gap: 0.5em
      margin-top: 0.5em
      color: var(--text-light)

      @media screen and (max-width: 768px)
        flex-direction: column
        gap: 0.5em

      &__current
        flex: 1

      &__min,
      &__max
        b
          color: var(--form-text-color)
          &.error
            color: var(--danger)
</style>
