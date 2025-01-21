<template>
  <div class="video-list-view">
    <div class="video-list-view__list">
      <video-card
        v-for="video in videos"
        :key="video.id"
        :video="video"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Core } from '@/core/Core'
import type { Video } from '@/core/data/entities/Video'

interface Props {
  videos?: Video[]
}

const defaultVideo: Video = {
  id: '1',
  title: 'Разбор нового материала о селекции',
  uploadedBy: Core.Context.User!,
  thumbnail: {
    id: '1',
    src: '/img/placeholder.svg',
    mimeType: 'image/jpeg',
    name: 'thumbnail.jpg',
    createdAt: new Date(),
    order: 1
  },
  description: {
    ops: [
      {
        insert:
          'В этом видео мы разберем новый материал о селекции, который был представлен на прошлой неделе. Все вопросы задавайте в комментариях!'
      }
    ]
  },
  url: 'https://www.youtube.com/watch?v=6n3pFFPSlW4',
  sizeInBytes: 123456,
  comments: [],
  accessType: 'everyone',
  accessValue: null,
  serviceType: 'yandex',
  state: 'uploaded',
  uniqueIdentifier: '1',
  duration: 1234,
  chapters: [],
  uploadUrl: 'https://www.youtube.com/watch?v=6n3pFFPSlW4',
  publishedAt: new Date()
}

const { videos = [defaultVideo, defaultVideo] } = defineProps<Props>()
</script>

<style scoped lang="sass">
.video-list-view
	&__search
		display: flex
		gap: 1em

		@media (max-width: 768px)
			flex-direction: column

		&__field
			flex: 1

		&__actions
			font-size: 1.15em

	&__list
		&__item
			padding: 1em 0
</style>
