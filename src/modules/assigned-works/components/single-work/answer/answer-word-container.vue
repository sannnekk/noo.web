<template>
  <div class="task-answer-container">
    <h4 class="task-answer-container__title">Ответ:</h4>
    <form-input
      label="Пробелы и регистр не учитываются в процессе проверки"
      :readonly="readonly"
      v-model="model"
      type="text"
      :validators="[
        (value) => (value as string).length < 100 || 'Ответ не должен превышать 100 символов'
      ]"
    />
  </div>
</template>

<script setup lang="ts">
import type { AssignedWork } from '@/core/data/entities/AssignedWork'
import type { Task } from '@/core/data/entities/Task'
import type { Answer } from '@/core/data/entities/Answer'
import { entityFactory } from '@/core/utils/entityFactory'
import { ref, watch } from 'vue'

interface Props {
  modelValue: AssignedWork
  taskId: Task['id']
  readonly?: boolean
}

interface Emits {
  (e: 'update:modelValue', value: AssignedWork): void
}

const props = defineProps<Props>()
const emits = defineEmits<Emits>()

const model = ref(getWordAnswer())
watch(model, insertWordAnswer, { immediate: true })

function insertWordAnswer(value: string) {
  let answer = props.modelValue.answers.find(
    (answer) => answer.taskId === props.taskId
  )

  if (!answer) {
    answer = entityFactory<Answer>('answer')
    answer.content = null
    answer.taskId = props.taskId

    emits('update:modelValue', {
      ...props.modelValue,
      answers: [...props.modelValue.answers, answer]
    })
  } else {
    answer.word = value
    emits('update:modelValue', props.modelValue)
  }
}

function getWordAnswer() {
  const answer = props.modelValue.answers.find(
    (answer) => answer.taskId === props.taskId
  )

  return answer?.word || ''
}
</script>

<style scoped lang="sass">
.task-answer-container
  &__title
    font-weight: 700
    font-size: 1.5em
    margin-bottom: 0.5em
    margin-left: 0.3em
</style>
