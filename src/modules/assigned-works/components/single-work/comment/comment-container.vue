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
      v-model:cursor-position="cursorPosition"
      :key="reloadTrigger"
    />
    <div
      class="task-comment-container__snippets"
      v-if="!readonly && snippets.length"
    >
      <div class="task-comment-container__snippets__title">
        <h4>Сниппеты:</h4>
      </div>
      <div class="task-comment-container__snippets__list">
        <div
          class="task-comment-container__snippets__list__item"
          v-for="snippet in snippets"
          :key="snippet.id"
        >
          <span
            class="task-comment-container__snippets__list__item__snippet"
            @click="applySnippet(snippet)"
          >
            {{ snippet.name }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { AssignedWork } from '@/core/data/entities/AssignedWork'
import type { Task } from '@/core/data/entities/Task'
import type { Comment } from '@/core/data/entities/Comment'
import { entityFactory } from '@/core/utils/entityFactory'
import {
  isDeltaEmptyOrWhitespace,
  insertInDelta
} from '@/core/utils/deltaHelpers'
import { computed, ref, shallowRef, watch } from 'vue'
import type { Snippet } from '@/core/data/entities/Snippet'

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

const reloadTrigger = ref(0)

function applySnippet(snippet: Snippet) {
  model.value = insertInDelta(
    model.value,
    snippet.content,
    actualCursorPosition.value
  )

  reloadTrigger.value++
}
</script>

<style scoped lang="sass">
.task-comment-container
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
