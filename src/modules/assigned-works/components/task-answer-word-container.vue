<template>
  <div class="task-answer-container">
    <h4 class="task-answer-container__title">Ответ:</h4>
    <form-input
      label="Пробелы и регистр не учитываются в процессе проверки"
      :readonly="readonly"
      v-model="model"
    />
  </div>
</template>

<script setup lang="ts">
import type { AssignedWork } from '@/core/data/entities/AssignedWork'
import type { Task } from '@/core/data/entities/Task'
import type { Answer } from '@/core/data/entities/Answer'
import { entityFactory } from '@/core/utils/entityFactory'
import { computed } from 'vue'

interface Props {
  modelValue: AssignedWork
  task: Task
  readonly?: boolean
}

interface Emits {
  (e: 'update:modelValue', value: AssignedWork): void
}

const props = defineProps<Props>()
const emits = defineEmits<Emits>()

const model = computed<Answer['word']>({
  get() {
    const existingAnswer = (props.modelValue.answers || []).find(
      (answer) => answer.taskId === props.task.id
    )

    if (existingAnswer) {
      return existingAnswer.word!
    }

    const answer = entityFactory<Answer>('answer')
    answer.taskId = props.task.id

    const work = { ...props.modelValue }
    work.answers.push(answer)
    work.answerIds.push(answer.id)

    emits('update:modelValue', props.modelValue)

    return answer.word!
  },
  set(value: Answer['word']) {
    const work = { ...props.modelValue }

    work.answers.find((answer) => answer.taskId === props.task.id)!.word = value

    emits('update:modelValue', work)
  }
})
</script>

<style scoped lang="sass">
.task-answer-container
  &__title
    font-weight: 500
    margin-bottom: 0.5em
</style>
