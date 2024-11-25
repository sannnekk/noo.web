<template>
  <div class="video-creation-form">
    <div class="form-group">
      <form-input
        label="Название"
        v-model="video.title"
        type="text"
        :validators="[
				(value) => (value as string).length > 0 || 'Введите название видео',
				(value) => (value as string).length <= 100 || 'Название не должно превышать 100 символов'
			]"
      />
    </div>
    <div class="form-group">
      <rich-text-editor
        title="Описание"
        v-model="video.description"
      />
    </div>
    <div class="form-group">
      <div class="row">
        <div class="col-md-6">
          <form-input
            label="Дата публикации"
            v-model="video.publishedAt"
            type="date"
          />
        </div>
        <div class="col-md-6"></div>
      </div>
    </div>
    <div class="form-group">
      <video-upload-button
        :service-type="video.serviceType"
        :upload-url="video.uploadUrl"
        :state="video.state"
        @before-upload="onBeforeUpload($event)"
        @upload-finished="onUploadFinished()"
        @error="onError()"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Core } from '@/core/Core'
import type { Media } from '@/core/data/entities/Media'
import type { Video } from '@/core/data/entities/Video'
import { emptyDelta } from '@/core/utils/deltaHelpers'
import { ref } from 'vue'
import { getVideoDuration } from './utils'

type UnsavedVideo = Omit<Video, 'id' | 'thumbnail' | 'uploadedBy'> & {
  thumbnail: Media | null
  id: string | null
  uploadUrl: string | null
  url: string | null
}

interface Emits {
  (event: 'video-created', video: Video): void
}

const emits = defineEmits<Emits>()

const videoService = Core.Services.Video
const uiService = Core.Services.UI

const video = ref<UnsavedVideo>({
  id: null,
  title: '',
  description: emptyDelta(),
  publishedAt: new Date(),
  serviceType: 'yandex',
  uniqueIdentifier: '',
  state: 'not-uploaded',
  sizeInBytes: 0,
  length: 0,
  chapters: [],
  thumbnail: null as Media | null,
  uploadUrl: null,
  url: null
})

function validateVideoData() {
  if (!video.value.title.length || video.value.title.length > 100) {
    uiService.openErrorModal(
      'Не удалось создать видео',
      'Название не должно быть пустым или превышать 100 символов'
    )
    return false
  }

  if (!video.value.serviceType) {
    uiService.openErrorModal(
      'Не удалось создать видео',
      'Выберите сервис для загрузки видео'
    )
    return false
  }

  return true
}

/**
 * Create a video on the server and get the upload url back
 */
async function onBeforeUpload(file: File) {
  if (!validateVideoData()) {
    return
  }

  try {
    video.value.length = getVideoDuration(file)
  } catch (error: any) {
    uiService.openErrorModal('Не удалось загрузить видео', error.message)
  }

  video.value.sizeInBytes = file.size

  try {
    const response = await videoService.createVideo(video.value as Video, {
      showLoader: true
    })

    if (!response.data?.uploadUrl) {
      throw new Error('Не удалось получить ссылку для загрузки видео')
    }

    video.value.uploadUrl = response.data.uploadUrl
  } catch (error: any) {
    uiService.openErrorModal('Не удалось загрузить видео', error.message)
  }

  video.value.state = 'uploading'
}

/**
 * Send the request to the server to notify that the video has been uploaded
 */
async function onUploadFinished() {
  video.value.state = 'uploaded'

  if (!video.value.id) {
    return
  }

  try {
    await videoService.finishUpload(video.value.id, {
      showLoader: true
    })

    emits('video-created', video.value as Video)
  } catch (error: any) {
    uiService.openErrorModal('Не удалось загрузить видео', error.message)
  }
}

/**
 * Delete a video from the server in case of an error
 */
async function onError() {}
</script>

<style scoped lang="sass"></style>
