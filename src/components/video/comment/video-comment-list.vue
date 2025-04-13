<template>
  <div class="video-comment-list">
    <div class="video-comment-list__title">
      <h3>Комментарии</h3>
    </div>
    <div
      class="video-comment-list__items"
      v-auto-animate
    >
      <video-comment
        v-for="comment in comments"
        :key="comment.id"
        :comment="comment"
        @delete="$emit('delete-comment', $event)"
      />
    </div>
    <p
      class="video-comment-list__empty"
      v-if="comments.length === 0"
    >
      Комментариев пока нет
    </p>
  </div>
</template>

<script lang="ts" setup>
import type { VideoComment } from '@/core/data/entities/VideoComment'

interface Props {
  comments: VideoComment[]
}

interface Emits {
  (event: 'delete-comment', commentId: VideoComment['id']): void
}

defineProps<Props>()
defineEmits<Emits>()
</script>

<style lang="sass" scoped>
.video-comment-list
	height: 100%
	overflow-y: auto

	&__title
		h3
			margin-top: 0.3em
			margin-bottom: 0.5em

	&__items
		flex: 1

	&__empty
		color: var(--text-light)
		font-size: 0.8em
		margin-top: 0.5em
</style>
