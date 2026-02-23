<template>
  <div class="video-comment">
    <div class="video-comment__user">
      <inline-user-card :user="comment.user!" />
    </div>
    <div class="video-comment__text">
      {{ comment.text }}
    </div>
    <div class="video-comment__date">
      {{ useDate(comment.createdAt, { precision: 'minute' }).toBeautiful() }}
      <span v-if="canDeleteComment">
        &sdot;
        <inline-icon
          class="video-comment__delete-button"
          name="delete"
          @click="onDelete()"
        />
      </span>
    </div>
  </div>
  <sure-delete-modal
    v-model:visible="deleteCommentModalVisible"
    @confirm="onDelete()"
  >
    <template #title> Удаление комментария </template>
    <template #text>
      Вы уверены, что хотите удалить комментарий "{{ comment.text }}"?
    </template>
  </sure-delete-modal>
</template>

<script lang="ts" setup>
import { useDate } from '@/composables/useDate'
import { Core } from '@/core/Core'
import type { VideoComment } from '@/core/data/entities/VideoComment'
import { computed, ref } from 'vue'

interface Props {
  comment: VideoComment
}

interface Emits {
  (event: 'delete', commentId: VideoComment['id']): void
}

const props = defineProps<Props>()
const emits = defineEmits<Emits>()

const canDeleteComment = computed(
  () =>
    Core.Context.User!.id === props.comment.user?.id ||
    Core.Context.roleIs(['admin', 'teacher'])
)
const deleteCommentModalVisible = ref(false)

function onDelete() {
  if (deleteCommentModalVisible.value) {
    emits('delete', props.comment.id)
  } else {
    deleteCommentModalVisible.value = true
  }
}
</script>

<style lang="sass" scoped>
.video-comment
  margin-bottom: 0.5em
  padding: 0.2em 0.5em 0.2em 0.8em
  border-left: 0.3rem solid var(--border-color)
  border-radius: 3px

  &:hover
    background-color: var(--light)

  &__user
    margin: -0.2em 0
    font-size: 0.85em

  &__text
    font-size: 0.85em
    max-width: 100%
    overflow: hidden
    word-break: break-word

  &__date
    text-align: right
    font-size: 0.7em
    color: var(--text-light)

  &__delete-button
    cursor: pointer
    position: relative
    top: 2px

    &:hover
      --danger: var(--text-light)
</style>
