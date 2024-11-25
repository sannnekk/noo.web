<template>
  <div class="video-card">
    <div class="video-card__image">
      <uploaded-image :src="video.thumbnail.src" />
    </div>
    <div class="video-card__info">
      <h3 class="video-card__info__title">{{ video.title }}</h3>
      <div class="video-card__info__author">
        <inline-user-card :user="video.uploadedBy" />
      </div>
      <div
        class="video-card__info__description"
        v-if="video.description"
      >
        <rich-text-container :content="video.description" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Video } from '@/core/data/entities/Video'

interface Props {
  video: Video
}

defineProps<Props>()
</script>

<style scoped lang="sass">
.video-card
	display: flex
	gap: 1em

	&__image
		width: 100%
		max-width: 300px
		padding: 1em
		overflow: hidden
		border-radius: var(--border-radius)

	&__info
		flex: 1
		padding: 1em

		&__title
			font-size: 1.5em
			margin: 0
			margin-top: 0.5em

		&__author
			margin-top: 0em

		&__description
			margin-top: 1em
			font-size: 0.9em
			color: #666

			:deep()
				.quill-editor__content
					padding: 0
</style>
