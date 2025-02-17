<template>
  <div
    class="video-view"
    v-if="videoStore.video"
  >
    <div class="video-view__player">
      <video-player
        :video="videoStore.video"
        :key="videoStore.video.id"
      />
    </div>
    <div class="video-view__comments">
      <div class="video-view__comments__list">
        <video-comment-list
          :comments="videoStore.comments.results"
          @delete-comment="videoStore.deleteComment($event)"
        />
      </div>
      <div class="video-view__comments__form">
        <video-comment-form
          :video-id="videoStore.video.id"
          @comment-created="videoStore.comments.trigger()"
        />
      </div>
    </div>
    <div class="video-view__info">
      <div class="video-view__info__back-button">
        <back-button to="/nootube"> Назад к списку видео </back-button>
      </div>
      <h1 class="video-view__info__title">
        {{ videoStore.video.title }}
      </h1>
      <div class="video-view__info__author">
        <inline-user-card :user="videoStore.video.uploadedBy" />
      </div>
      <div
        class="video-view__info__link"
        v-if="Core.Context.roleIs(['admin', 'teacher'])"
      >
        <form-input
          label="Ссылка на видео для вставки"
          :model-value="videoStore.video.url!"
          type="text"
          readonly
          copy-button
        />
      </div>
      <div class="video-view__info__description">
        <rich-text-container
          :content="videoStore.video.description"
          no-padding
        />
      </div>
    </div>
    <!--
    <div class="video-view__other-videos">
      <h2 class="video-view__other-videos__title">Другие видео</h2>
      <video-list :videos="videoStore.similarVideos.results" />
    </div>
    -->
  </div>
  <div
    class="video-view__not-found"
    v-else
  >
    <nothing-found />
    <h4>Видео не найдено</h4>
  </div>
</template>

<script setup lang="ts">
import { Core } from '@/core/Core'
import { setPageTitle } from '@/core/utils/setPageTitle'
import { watch } from 'vue'
import { useVideoStore } from '../stores/video'
import { useRoute } from 'vue-router'

const route = useRoute()
const videoStore = useVideoStore()

watch(
  () => route.params.id,
  async () => {
    await videoStore.fetchVideo(route.params.id as string)
    await videoStore.comments.trigger()
    setPageTitle(videoStore.video?.title || 'Видео')
  },
  { immediate: true }
)
</script>

<style scoped lang="sass">
.video-view
	padding: 1em
	display: grid
	grid-template-columns: 1fr 300px
	grid-template-areas: "player comments" "info comments" "other-videos other-videos"
	gap: 1em

	@media (max-width: 1200px)
		grid-template-columns: 1fr
		grid-template-areas: "player" "info" "comments" "other-videos"

	&__not-found
		height: 500px
		display: flex
		justify-content: center
		align-items: center

	&__player
		grid-area: player
		min-height: 350px

	&__comments
		grid-area: comments
		display: flex
		flex-direction: column
		padding: 1em
		border-radius: var(--border-radius)
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.1)

		&__list
			flex: 1
			overflow-y: auto
			max-height: 80vh

	&__info
		grid-area: info

		&__title
			margin-top: 0
			margin-bottom: 0.5em
			font-size: 1.3em

		&__link
			margin: 0.4em 0 1em 0

	&__other-videos
		margin-top: 1em
		grid-area: other-videos

		&__title
			margin-bottom: 0.5em
			font-size: 1em
</style>
