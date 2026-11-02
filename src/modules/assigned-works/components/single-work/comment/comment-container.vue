<template>
  <div
    class="task-comment-container"
    v-if="
      mode === 'check' || canUseShpuntik || !isDeltaEmptyOrWhitespace(model)
    "
  >
    <div class="task-comment-container__header">
      <h4 class="task-comment-container__title">Комментарий:</h4>
      <div
        class="task-comment-container__shpuntik"
        v-if="canUseShpuntik"
      >
        <common-button
          v-if="isDeltaEmptyOrWhitespace(model)"
          design="inline"
          icon="noo-shpuntik"
          @click="shpuntikStore.openModal(task.id)"
        >
          Проверить НОО.Шпунтиком
        </common-button>
        <common-button
          v-else
          design="danger"
          @click="shpuntikStore.removeComment(task.id)"
        >
          Удалить комментарий
        </common-button>
      </div>
    </div>
    <rich-text-container
      v-if="readonly"
      :content="model"
    />
    <rich-text-area
      v-else
      v-model="model"
      v-model:cursor-position="cursorPosition"
      :snippets="snippets"
    />
  </div>
</template>

<script setup lang="ts">
import type { AssignedWork } from '@/core/data/entities/AssignedWork'
import type { Task } from '@/core/data/entities/Task'
import type { Comment } from '@/core/data/entities/Comment'
import { entityFactory } from '@/core/utils/entityFactory'
import { isDeltaEmptyOrWhitespace } from '@/core/utils/deltaHelpers'
import { computed, shallowRef, watch } from 'vue'
import type { Snippet } from '@/core/data/entities/Snippet'
import { Core } from '@/core/Core'
import { useShpuntikStore } from '../../../stores/shpuntikStore'
import {
  isCheckedAutomatically,
  isWorkChecked,
  isWorkMade
} from '../../../utils/task'

interface Props {
  modelValue: AssignedWork
  task: Task
  readonly?: boolean
  mode: 'solve' | 'check' | 'read'
  snippets: Snippet[]
}

interface Emits {
  (e: 'update:modelValue', value: AssignedWork): void
}

const props = defineProps<Props>()
const emits = defineEmits<Emits>()

const shpuntikStore = useShpuntikStore()

const canUseShpuntik = computed(
  () =>
    Core.Context.roleIs(['teacher']) &&
    isWorkMade(props.modelValue) &&
    !isWorkChecked(props.modelValue) &&
    !isCheckedAutomatically(props.task.type)
)

const cursorPosition = shallowRef(0)
const actualCursorPosition = shallowRef(0)

watch(cursorPosition, () =>
  cursorPosition.value !== 0
    ? (actualCursorPosition.value = cursorPosition.value)
    : 0
)

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
</script>

<style scoped lang="sass">
.task-comment-container
  &__header
    display: flex
    justify-content: space-between
    align-items: center
    gap: 1em
    margin-bottom: 0.5em

    .task-comment-container__title
      margin-bottom: 0

  &__shpuntik
    font-size: 0.8em

  &__title
    font-weight: 700
    font-size: 1em
    margin-bottom: 0.5em

  &__snippets
    margin-top: 1em

    &__list
      display: flex
      flex-wrap: wrap
      gap: 0.5em

      &__item
        &__snippet
          font-size: 12px
          color: var(--form-text-color)
          cursor: pointer
          border: 1px dashed var(--border-color)
          padding: 0.5em 1em
          border-radius: 100px

          &:hover
            background-color: var(--border-color)
</style>
