<template>
  <div class="video-list-view">
    <div class="video-list-view__search">
      <div class="video-list-view__search__field">
        <search-field
          v-model="nootubeStore.videoSearch.pagination.search"
          :is-loading="nootubeStore.videoSearch.isListLoading"
        />
      </div>
      <div
        class="video-list-view__search__actions"
        v-if="Core.Context.roleIs(['mentor', 'teacher'])"
      >
        <common-button to="/nootube/upload-video">
          Загрузить видео
        </common-button>
      </div>
    </div>
    <div class="video-list-view__list">
      <video-card
        v-for="video in nootubeStore.videoSearch.results"
        :key="video.id"
        :video="video"
      />
      <div class="video-list-view__list__item">
        <video-card
          :video="{
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
							insert: 'В этом видео мы разберем новый материал о селекции, который был представлен на прошлой неделе. Все вопросы задавайте в комментариях!'
						}
					]
				},
				url: 'https://www.youtube.com/watch?v=6n3pFFPSlW4',
				sizeInBytes: 0,
				serviceType: 'yandex',
				state: 'uploaded',
				uniqueIdentifier: '1',
				length: 1234,
				chapters: [],
				uploadUrl: 'https://www.youtube.com/watch?v=6n3pFFPSlW4',
				publishedAt: new Date(),
			}"
        />
      </div>
    </div>
    <div class="video-list-view__pagination">
      <list-pagination
        v-model:page="nootubeStore.videoSearch.pagination.page"
        :total="nootubeStore.videoSearch.resultsMeta.total"
        :limit="nootubeStore.videoSearch.pagination.limit"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Core } from '@/core/Core'
import { useNooTubeStore } from '../stores/nootube'

const nootubeStore = useNooTubeStore()
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
