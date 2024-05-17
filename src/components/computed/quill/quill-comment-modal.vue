<template>
  <overlay-hint
    :position="positionModel"
    v-model:visible="visibilityModel"
    absolute
  >
    <div class="comment-modal">
      <div class="comment-modal__title">
        <h3
          class="comment-modal__title--error"
          v-if="comment.type === 'fact-error'"
        >
          Фактическая ошибка
        </h3>
        <h3
          class="comment-modal__title--warning"
          v-else
        >
          Логическая ошибка
        </h3>
      </div>
      <div class="comment-modal__text">
        <p>
          {{ comment.content }}
        </p>
      </div>
      <div
        class="comment-modal__buttons"
        v-if="editable"
      >
        <common-button
          alignment="stretch"
          @click="onDelete()"
          design="danger"
          class="comment-modal__buttons__remove"
        >
          Удалить
        </common-button>
      </div>
    </div>
  </overlay-hint>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Comment } from './CommentBlot'
import type { ImageComment } from './ImageCommentBlot'

interface Props {
  visible?: boolean
  comment: Comment & ImageComment
  editable?: boolean
  positionX: number
  positionY: number
}

interface Emits {
  (e: 'update:visible', value: boolean): void
  (e: 'delete'): void
}

const props = defineProps<Props>()
const emits = defineEmits<Emits>()

const visibilityModel = computed({
  get: () => props.visible,
  set: (value: boolean) => emits('update:visible', value)
})

const positionModel = computed(() => ({
  x: window.innerWidth > 400 ? props.positionX : 10,
  y: props.positionY + (props.comment.imageSrc ? 0 : 10)
}))

function onDelete() {
  emits('delete')
}
</script>

<style scoped lang="sass">
.comment-modal
  &__title
    font-size: 0.9em
    font-weight: 500
    margin-bottom: 0.5em
    margin-top: 0
    padding-top: 0
    padding-right: 3em

    &--error
      color: var(--danger)

    &--warning
      color: var(--warning)

  &__text
    margin-bottom: 1em
    font-size: 0.9em
    color: var(--text-light)
    max-width: 300px

    p
      margin: 0
      text-overflow: ellipsis
      white-space: wrap

  &__buttons
    display: flex
    flex-direction: row
    justify-content: space-between
    font-size: 0.8em

    &__cancel
      margin-right: 0.5em
</style>
