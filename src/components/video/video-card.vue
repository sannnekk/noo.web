<template>
  <div
    class="video-card"
    :class="{
      'video-card--small': small,
      'video-card--selected': selectable && isSelected
    }"
  >
    <router-link
      class="video-card__preview"
      :to="selectable ? '' : link"
      @click.prevent="selectable && $emit('select')"
    >
      <div
        class="video-card__preview__view-button"
        v-if="!small"
      >
        <inline-icon name="play" />
      </div>
      <div class="video-card__preview__image">
        <uploaded-image :src="video.thumbnail?.src" />
      </div>
      <div class="video-card__preview__duration">
        {{ duration }}
      </div>
    </router-link>
    <div
      class="video-card__preview__actions"
      v-if="Core.Context.roleIs(['teacher', 'admin', 'mentor']) && showActions"
    >
      <more-widget :items="actions" />
    </div>
    <div class="video-card__info">
      <div class="video-card__info__header">
        <h3 class="video-card__info__title">
          <router-link
            :to="selectable ? '' : link"
            @click.prevent="selectable && $emit('select')"
          >
            {{ video.title }}
          </router-link>
        </h3>
      </div>
      <div class="video-card__info__author">
        <inline-user-card
          :user="video.uploadedBy"
          v-if="video.uploadedBy"
        >
          <template #under-name>
            <span class="video-card__info__author__info">
              Опубликовано
              {{
                useDate(video.publishedAt, { precision: 'day' }).toBeautiful()
              }}
              •
              {{ videoVisibilityText(video) }}
            </span>
          </template>
        </inline-user-card>
      </div>
    </div>
  </div>
  <sure-delete-modal
    v-model:visible="deleteVideoModalVisible"
    @confirm="$emit('delete-video', video.id)"
  >
    <template #title>Удаление видео</template>
    <template #text>
      Вы уверены, что хотите удалить видео "{{ video.title }}"?
    </template>
  </sure-delete-modal>
  <edit-video-modal
    v-model:visible="editVideoModalVisible"
    :video="video"
    @edited="onVideoEdit()"
  />
</template>

<script setup lang="ts">
import type { Video } from '@/core/data/entities/Video'
import { computed, reactive, ref } from 'vue'
import { stringifyDuration, videoVisibilityText } from './utils'
import type { MenuItem } from '../../widgets/noo-more-widget.vue'
import { Core } from '@/core/Core'
import { useDate } from '@/composables/useDate'

interface Props {
  video: Video
  small?: boolean
  showActions?: boolean
  selectable?: boolean
  isSelected?: boolean
}

interface Emits {
  (event: 'delete-video', videoId: Video['id']): void
  (event: 'updated'): void
  (event: 'select'): void
}

const props = defineProps<Props>()
const emits = defineEmits<Emits>()

const link = computed(() => `/nootube/video/${props.video.id}`)
const duration = computed(() => stringifyDuration(props.video.duration))
const editVideoModalVisible = ref(false)
const deleteVideoModalVisible = ref(false)

const actions = reactive<MenuItem[]>([
  {
    title: 'Изменить',
    icon: 'edit',
    if:
      Core.Context.roleIs(['teacher', 'admin']) ||
      Core.Context.User!.id === props.video.uploadedBy?.id,
    action: () => {
      editVideoModalVisible.value = true
    }
  },
  {
    title: 'Удалить',
    icon: 'delete',
    if:
      Core.Context.roleIs(['teacher', 'admin']) ||
      Core.Context.User!.id === props.video.uploadedBy?.id,
    action: () => {
      deleteVideoModalVisible.value = true
    }
  }
])

function onVideoEdit() {
  emits('updated')
}
</script>

<style scoped lang="sass">
.video-card
  display: flex
  flex-direction: column
  position: relative

  &--selected
    border: 1px solid var(--lila) !important
    border-radius: var(--border-radius) !important

  &--small
    padding: 1em 0.5em 0.3em 0.5em
    flex-direction: row
    align-items: center
    border-bottom: 1px solid var(--border-color)

    .video-card
      &__preview
        height: 3em
        width: unset
        aspect-ratio: 1.5848
        margin-bottom: 1em

        &__duration
          display: none

      &__info
        flex: 1
        padding-left: 1em

        &__header
          padding-top: 0em

        &__title
          font-size: 1.2em

        &__author
          margin-top: 0em

          &__info
            line-height: 1em
            display: block
            font-size: 0.8em

  &__preview
    position: relative
    cursor: pointer
    display: block
    text-decoration: none
    color: inherit
    border-radius: var(--border-radius)
    overflow: hidden
    width: 100%
    aspect-ratio: 1.5848

    &:hover
      .video-card__preview__view-button
        transform: translate(-50%, -50%) scale(1.2)
        opacity: 1

    &__image
      width: 100%
      height: 100%
      overflow: hidden
      border-radius: var(--border-radius)

      img
        width: 100%
        height: 100%
        object-fit: cover

    &__duration
      position: absolute
      bottom: 5px
      right: 5px
      background: rgba(0, 0, 0, 0.5)
      color: white
      padding: 0em 0.5em
      border-radius: var(--border-radius)
      font-size: 0.9em

    &__actions
      position: absolute
      top: 5px
      right: 5px
      z-index: 1
      border-radius: 50px

    &__view-button
      position: absolute
      top: 50%
      left: 50%
      transform: translate(-50%, -50%) scale(0.5)
      font-size: 4em
      color: white
      cursor: pointer
      transition: 0.2s ease all
      opacity: 0

      &:hover
        transform: translate(-50%, -50%) scale(1.3) !important

  &__info
    flex: 1
    display: flex
    flex-direction: column
    justify-content: center

    &__header
      padding-top: 1em

    &__title
      font-size: 1.2em
      margin: 0

      a
        color: inherit
        text-decoration: none

        &:hover
          color: var(--lila)

    &__author
      margin-top: 0em
      min-height: 1em

      &__info
        line-height: 1em
        display: block
        font-size: 0.9em
        color: var(--border-color)
</style>
