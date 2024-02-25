<template>
  <div class="task-score-container">
    <select-input
      label="Балл:"
      :options="scoreOptions"
      v-model="model"
      :readonly="props.readonly"
    />
  </div>
</template>

<script setup lang="ts">
import type { AssignedWork } from '@/core/data/entities/AssignedWork'
import type { Comment } from '@/core/data/entities/Comment'
import type { Task } from '@/core/data/entities/Task'
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

const scoreOptions = computed(() => {
  const options = []

  for (let i = 0; i <= props.task.highestScore; i++) {
    options.push({
      label: i.toString(),
      value: i.toString()
    })
  }

  return options
})

const model = computed<Comment['score']>({
  get() {
    const existingComment = props.modelValue.comments.find(
      (comment) => comment.taskId === props.task.id
    )

    if (existingComment) {
      return existingComment.score
    }

    const comment = entityFactory<Comment>('comment')
    comment.taskId = props.task.id

    const work = { ...props.modelValue }
    work.comments.push(comment)
    work.commentIds.push(comment.id)

    emits('update:modelValue', work)

    return comment.score
  },
  set(value: Comment['score']) {
    const work = { ...props.modelValue }
    work.comments.find((comment) => comment.taskId === props.task.id)!.score =
      Number(value)

    emits('update:modelValue', work)
  }
})
</script>

<style scoped lang="sass">
.task-comment-container
  &__title
    font-weight: 500
</style>
@/core/data/entities/Comment @/core/data/entities/AssignedWork
@/core/data/entities/Task @/core/utils/entityFactory
