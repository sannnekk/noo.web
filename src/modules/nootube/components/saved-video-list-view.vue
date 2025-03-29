<template>
  <div class="video-list-view">
    <div class="video-list-view__search">
      <div class="video-list-view__search__field">
        <search-field
          v-model="nootubeStore.savedVideoSearch.pagination.search"
          :is-loading="nootubeStore.savedVideoSearch.isListLoading"
        />
      </div>
    </div>
    <div class="video-list-view__list">
      <div class="video-list-view__list__item">
        <video-list
          :videos="nootubeStore.savedVideoSearch.results"
          :is-loading="nootubeStore.savedVideoSearch.isListLoading"
          @delete-video="nootubeStore.deleteVideo($event)"
          @updated="nootubeStore.savedVideoSearch.trigger()"
        />
      </div>
    </div>
    <div class="video-list-view__pagination">
      <list-pagination
        v-model:page="nootubeStore.savedVideoSearch.pagination.page"
        :total="nootubeStore.savedVideoSearch.resultsMeta.total"
        :limit="nootubeStore.savedVideoSearch.pagination.limit"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useNooTubeStore } from '../stores/nootube'

const nootubeStore = useNooTubeStore()
</script>

<style scoped lang="sass">
.video-list-view
	&__list
		&__item
			padding: 1em 0
</style>
