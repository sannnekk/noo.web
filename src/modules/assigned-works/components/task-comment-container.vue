<template>
  <div
    class="task-comment-container"
    v-if="mode === 'check' || !isDeltaEmptyOrWhitespace(model)"
  >
    <h4 class="task-comment-container__title">Комментарий:</h4>
    <rich-text-container
      v-if="readonly"
      :content="model"
    />
    <rich-text-area
      v-else
      v-model="model"
      :additional-modules="additionalModules"
      :additional-module-options="additionalModuleOptions"
    />
  </div>
</template>

<script setup lang="ts">
import type { AssignedWork } from '@/core/data/entities/AssignedWork'
import type { Task } from '@/core/data/entities/Task'
import type { Comment } from '@/core/data/entities/Comment'
import { entityFactory } from '@/core/utils/entityFactory'
import { isDeltaEmptyOrWhitespace } from '@/core/utils/deltaHelpers'
import { QuillSelectionModule } from '@/core/utils/quill/QuillSelectionModule'
import { computed } from 'vue'

interface Props {
  modelValue: AssignedWork
  task: Task
  readonly?: boolean
  mode: 'solve' | 'check' | 'read'
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

const additionalModules = {
  quoteSelection: QuillSelectionModule
}

const additionalModuleOptions = {
  quoteSelection: {}
}
</script>

<style scoped lang="sass">
.task-comment-container
  &__title
    font-weight: 700
    font-size: 1.5em
    margin-bottom: 0.5em
    margin-left: 0.3em
</style>
