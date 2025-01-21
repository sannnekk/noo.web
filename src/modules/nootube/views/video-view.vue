<template>
  <div class="video-view">
    <div class="video-view__player">
      <video-player :video="video" />
    </div>
    <div class="video-view__comments">
      <div class="video-view__comments__list">
        <video-comment-list :comments="video.comments" />
      </div>
      <div class="video-view__comments__form">
        <video-comment-form :video-id="video.id" />
      </div>
    </div>
    <div class="video-view__info">
      <h1 class="video-view__info__title">
        {{ video.title }}
      </h1>
      <div class="video-view__info__author">
        <inline-user-card :user="video.uploadedBy" />
      </div>
      <div class="video-view__info__description">
        <rich-text-container
          :content="video.description"
          no-padding
        />
      </div>
    </div>
    <div class="video-view__other-videos">
      <h2 class="video-view__other-videos__title">Другие видео</h2>
      <video-list-view />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Core } from '@/core/Core'
import videoListView from '../components/video-list-view.vue'
import type { Video } from '@/core/data/entities/Video'
import { setPageTitle } from '@/core/utils/setPageTitle'
import { onMounted, ref } from 'vue'

const video = ref<Video>({
  id: '1',
  title: 'Video title',
  description: {
    ops: [
      {
        insert: 'Description\n'
      }
    ]
  },
  comments: [
    {
      id: '2',
      text: 'Comment text',
      createdAt: new Date(),
      updatedAt: new Date(),
      user: Core.Context.User!,
      videoId: '1'
    },
    {
      id: '2',
      text: 'Comment text',
      createdAt: new Date(),
      updatedAt: new Date(),
      user: Core.Context.User!,
      videoId: '1'
    },
    {
      id: '2',
      text: 'Comment text',
      createdAt: new Date(),
      updatedAt: new Date(),
      user: Core.Context.User!,
      videoId: '1'
    }
  ],
  duration: 100,
  url: '',
  sizeInBytes: 123,
  serviceType: 'yandex',
  state: 'uploaded',
  uniqueIdentifier: '',
  chapters: [],
  uploadUrl: '',
  publishedAt: new Date(),
  accessType: 'everyone',
  accessValue: null,
  thumbnail: {
    id: '1',
    src: 'https://via.placeholder.com/300',
    mimeType: 'image/jpeg',
    name: 'thumbnail',
    createdAt: new Date(),
    order: 0
  },
  uploadedBy: {
    id: '1',
    name: 'Name',
    username: 'sannnekk',
    slug: 'sannnekk',
    role: 'teacher',
    email: 'nukleoid@outlook.com',
    isBlocked: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    telegramNotificationsEnabled: false,
    avatar: {
      id: '1',
      avatarType: 'custom',
      telegramAvatarUrl: null,
      media: {
        id: '1',
        src: 'https://via.placeholder.com/300',
        mimeType: 'image/jpeg',
        name: 'thumbnail',
        createdAt: new Date(),
        order: 0
      }
    }
  }
})

onMounted(() => {
  setPageTitle(video.value.title)
})
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

	&__player
		grid-area: player
		aspect-ratio: 1.5

	&__comments
		grid-area: comments
		display: flex
		flex-direction: column
		padding: 1em
		border-radius: var(--border-radius)
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.1)

		&__list
			flex: 1

	&__info
		grid-area: info

		&__title
			margin-top: 0
			margin-bottom: 0.5em
			font-size: 1.3em

	&__other-videos
		margin-top: 1em
		grid-area: other-videos

		&__title
			margin-bottom: 0.5em
			font-size: 1em
</style>
