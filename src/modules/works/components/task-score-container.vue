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
import type { AssignedWork } from '@/types/entities/AssignedWork'
import type { Comment } from '@/types/entities/Comment'
import type { Task } from '@/types/entities/Task'
import { computed } from 'vue'
import { entityFactory } from '@/utils/entityFactory'

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
      value

    emits('update:modelValue', work)
  }
})
</script>

<style scoped lang="sass">
.task-comment-container
  &__title
    font-weight: 500
</style>
