<template>
  <div class="task-answer-container">
    <h4 class="task-answer-container__title">Ответ:</h4>
    <rich-text-container
      v-if="readonly"
      :content="model"
    />
    <rich-text-area
      v-else
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

const model = computed<Answer['content']>({
  get() {
    const existingAnswer = props.modelValue.answers.find(
      (answer) => answer.taskId === props.task.id
    )

    if (existingAnswer) {
      return existingAnswer.content
    }

    const answer = entityFactory<Answer>('answer')
    answer.taskId = props.task.id

    const work = { ...props.modelValue }
    work.answers.push(answer)
    work.answerIds.push(answer.id)
    emits('update:modelValue', props.modelValue)

    return answer.content
  },
  set(value: Answer['content']) {
    const work = { ...props.modelValue }
    work.answers.find((answer) => answer.taskId === props.task.id)!.content =
      value

    emits('update:modelValue', work)
  }
})
</script>

<style scoped lang="sass">
.task-answer-container
  &__title
    font-weight: 500
</style>
@/core/data/entities/AssignedWork@/core/data/entities/Answer@/core/data/entities/Task
@/core/utils/entityFactory
