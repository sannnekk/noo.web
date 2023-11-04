<template>
  <div class="task-answer-container">
    <h4 class="task-answer-container__title">Ответ:</h4>
    <p class="task-answer-container__hint">
      {{
        multiple
          ? 'Несколько вариантов ответа могут быть правильными'
          : 'Только один вариант ответа правильный'
      }}
    </p>
    <div class="task-answer-container__list">
      <check-list
        :multiple="multiple"
        :items="task.options || []"
        :readonly="readonly"
        item-label-key="name"
        item-key="id"
        v-model="model"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { AssignedWork } from '@/types/entities/AssignedWork'
import type { Task } from '@/types/entities/Task'
import type { TaskOption } from '@/types/entities/TaskOption'
import type { Answer } from '@/types/entities/Answer'
import { computed } from 'vue'
import { entityFactory } from '@/utils/entityFactory'

interface Props {
  modelValue: AssignedWork
  task: Task
  readonly?: boolean
  multiple?: boolean
}

interface Emits {
  (e: 'update:modelValue', value: AssignedWork): void
}

const props = defineProps<Props>()
const emits = defineEmits<Emits>()

const model = computed<TaskOption['id'][]>({
  get: () => {
    let answer = props.modelValue.answers.find(
      (answer) => answer.taskId === props.task.id
    )

    if (!answer) {
      answer = entityFactory<Answer>('answer')
      answer.taskId = props.task.id
    }

    return answer.chosenTaskOptionIds || []
  },
  set: (value) => {
    const work = { ...props.modelValue }
    let answer = work.answers.find((answer) => answer.taskId === props.task.id)

    if (!answer) {
      answer = entityFactory<Answer>('answer')
      answer.taskId = props.task.id
      work.answers.push(answer)
      work.answerIds.push(answer.id)
    }

    answer.chosenTaskOptions = props.task.options!.filter((option) =>
      value.includes(option.id)
    )
    answer.chosenTaskOptionIds = answer.chosenTaskOptions.map(
      (option) => option.id
    )

    emits('update:modelValue', work)
  }
})
</script>

<style scoped lang="sass">
.task-answer-container
  &__title
    font-weight: 500
    margin-bottom: 0
    padding-bottom: 0

  &__hint
    font-size: 0.8rem
    margin-top: 0
    color: var(--text-light)

  &__list
    &:deep()
      *
        color: var(--dark) !important
</style>
