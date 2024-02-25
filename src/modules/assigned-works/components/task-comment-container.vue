<template>
  <div class="task-comment-container">
    <h4 class="task-comment-container__title">Комментарий:</h4>
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
import type { Comment } from '@/core/data/entities/Comment'
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

const model = computed<Comment['content']>({
  get() {
    const existingComment = props.modelValue.comments.find(
      (comment) => comment.taskId === props.task.id
    )

    if (existingComment) {
      return existingComment.content
    }

    const comment = entityFactory<Comment>('comment')
    comment.taskId = props.task.id

    const work = { ...props.modelValue }
    work.comments.push(comment)
    work.commentIds.push(comment.id)
    emits('update:modelValue', props.modelValue)

    return comment.content
  },
  set(value: Comment['content']) {
    const work = { ...props.modelValue }
    work.comments.find((comment) => comment.taskId === props.task.id)!.content =
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
@/core/data/entities/Comment@/core/data/entities/AssignedWork
@/core/data/entities/Task @/core/utils/entityFactory
