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
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useDate } from '@/composables/useDate'
import type { VideoComment } from '@/core/data/entities/VideoComment'

interface Props {
  comment: VideoComment
}

defineProps<Props>()
</script>

<style lang="sass" scoped>
.video-comment
	padding: 0.1em 0
	border-bottom: 1px solid var(--border-color)

	&__user
		margin: -0.2em 0
		font-size: 0.85em

	&__text
		font-size: 0.85em

	&__date
		text-align: right
		font-size: 0.7em
		color: var(--text-light)
</style>
