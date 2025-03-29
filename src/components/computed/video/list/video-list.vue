<template>
  <div class="video-list-view">
    <div
      class="video-list-view__loading"
      v-if="isLoading"
    >
      <loader-icon contrast />
    </div>
    <div
      class="video-list-view__list"
      v-else-if="!isLoading && videos?.length"
      v-auto-animate
    >
      <div
        class="video-list-view__list__item"
        v-for="video in videos"
        :key="video.id"
      >
        <video-card
          :video="video"
          @delete-video="$emit('delete-video', $event)"
          @updated="$emit('updated')"
        />
      </div>
    </div>
    <div
      class="video-list-view__nothing-found"
      v-else
    >
      <nothing-found-image />
      <h4>Видео не найдено</h4>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Video } from '@/core/data/entities/Video'

interface Props {
  videos?: Video[]
  isLoading?: boolean
}

interface Emits {
  (event: 'delete-video', videoId: string): void
  (event: 'updated'): void
}

defineProps<Props>()
defineEmits<Emits>()
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
		display: grid
		grid-template-columns: repeat(auto-fill, minmax(300px, 1fr))
		gap: 1em

	&__loading
		display: flex
		justify-content: center
		align-items: center
		height: 300px
		font-size: 3em

	&__nothing-found
		display: flex
		padding: 2em 0
		justify-content: center
		align-items: center
		flex-direction: column
		text-align: center

		*
			font-weight: 500

		svg
			width: min(90%, 400px)
			height: auto
</style>
