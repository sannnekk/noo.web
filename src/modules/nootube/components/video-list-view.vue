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
      <div class="video-list-view__list__item">
        <video-list
          :videos="nootubeStore.videoSearch.results"
          :is-loading="nootubeStore.videoSearch.isListLoading"
          @delete-video="nootubeStore.deleteVideo($event)"
          @updated="nootubeStore.videoSearch.trigger()"
          show-actions
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
			font-size: 1em

			@media (max-width: 768px)
				font-size: 0.85em

	&__list
		&__item
			padding: 1em 0
</style>
