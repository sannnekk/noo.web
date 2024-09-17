<template>
  <div
    class="task-answer-container"
    v-auto-animate
    v-if="model || !readonly"
  >
    <h4 class="task-answer-container__title">Ответ:</h4>
    <rich-text-container
      v-if="readonly"
      :content="model!"
      :commentable="commentable"
      @commented="onComment($event)"
    />
    <rich-text-area
      v-else
      v-model="model!"
    />
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
import { ref, watch } from 'vue'
import type { DeltaContentType } from '@/types/composed/DeltaContentType'
import { emptyDelta } from '@/core/utils/deltaHelpers'

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
</style>
