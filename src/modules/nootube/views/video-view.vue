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
      <div class="video-view__info__edit-button" v-if="Core.Context.roleIs(['teacher','admin'])">
        <span class="video-view__info__edit-button" @click="openEditVideoModal()">Редактировать видео</span>
      </div>
      <h1 class="video-view__info__title">
        {{ videoStore.video.title }}
      </h1>
      <div class="video-view__info__author">
        <inline-user-card :user="videoStore.video.uploadedBy" />
      </div>
      <div class="video-view__info__main">
        Опубликовано
        {{
          useDate(videoStore.video.publishedAt, {
            precision: 'day'
          }).toBeautiful()
        }}
        •
        {{ videoStore.accessInfo?.text }}
      </div>
      <div class="video-view__info__actions">
        <add-video-to-saved-button :video-id="videoStore.video.id" />
        <user-reactions
          :reactions="videoStore.video.reactionCounts!"
          :my-reaction="videoStore.video.myReaction!"
          :loading="videoStore.reactionsLoading"
          @react="videoStore.react($event)"
        />
      </div>
      <div
        class="video-view__info__link"
        v-if="Core.Context.roleIs(['admin', 'teacher'])"
      >
        <form-input
          label="Ссылка на видео"
          :model-value="currentVideoLink"
          type="text"
          readonly
          copy-button
        />
        <form-input
          label="Ссылка на видео для вставки в виде плеера"
          :model-value="currentVideoPlayerLink"
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
    <edit-video-modal v-model:visible="editVideoModalOpened" :video="videoStore.video" @edited="onVideoEdit()" />
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
import { watch, computed, ref } from 'vue'
import { useVideoStore } from '../stores/video'
import { useRoute } from 'vue-router'
import { useDate } from '@/composables/useDate'

const route = useRoute()
const videoStore = useVideoStore()

watch(
  () => route.params.id,
  async () => {
    await videoStore.fetchVideo(route.params.id as string)
    videoStore.comments.trigger()
    setPageTitle(`НОО.Tube - ${videoStore.video?.title}`)
  },
  { immediate: true }
)

const currentVideoLink = computed(() => {
  return Core.Constants.APP_URL + `/nootube/video/${videoStore.video?.id}`
})

const currentVideoPlayerLink = computed(() => {
  return `https://runtime.video.cloud.yandex.net/player/video/${videoStore.video?.uniqueIdentifier}`
})

const editVideoModalOpened = ref(false)

function openEditVideoModal() {
editVideoModalOpened.value = true
}

async function onVideoEdit() {
         await videoStore.fetchVideo(route.params.id as string)
    setPageTitle(`НОО.Tube - ${videoStore.video?.title}`)
}
</script>

<style scoped lang="sass">
.video-view
  padding: 1em
  display: grid
  grid-template-columns: 1fr 400px
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
    aspect-ratio: 16 / 9

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

    &__edit-button
      font-size: 0.9rem
      color: var(--text-light)
      cursor: pointer

      &:hover
        color: var(--text-form-color)

    &__title
      margin-top: 0
      margin-bottom: 0.5em
      font-size: 1.3em

    &__link
      margin: 0.4em 0 1em 0

      &__hint
        margin-top: 0.5em
        font-size: 0.8em

    &__main
      font-size: 0.9em
      color: var(--text-light)

    &__actions
      margin: 1em 0
      display: flex
      justify-content: space-between

      @media only screen and (max-width: 1000px)
        flex-direction: column
        gap: 1em

  &__other-videos
    margin-top: 1em
    grid-area: other-videos

    &__title
      margin-bottom: 0.5em
      font-size: 1em
</style>
