<template>
  <div
    class="video-creation-form"
    v-auto-animate
  >
    <div
      class="video-creation-form__info-step"
      v-if="step === 'info'"
    >
      <video-creation-info-form
        v-model:video="video"
        @next-step="step = 'upload'"
      />
    </div>
    <div
      class="video-creation-form__upload-step"
      v-else-if="step === 'upload'"
    >
      <video-creation-upload-form
        :upload-url="video.uploadUrl"
        :service-type="video.serviceType"
        :video-link="videoLink"
        @before-upload="registerVideo($event)"
        @finish-upload="finishUpload()"
        @publish="publishVideo()"
      />
    </div>
    <div
      class="video-creation-form__success-step"
      v-else-if="step === 'success'"
    >
      <h1 class="video-creation-form__success-step__title">
        Видео успешно загружено
      </h1>
      <p class="video-creation-form__success-step__hint">
        Видео будет доступно после обработки, это может занять некоторое время.
        Чем больше видео, тем дольше обработка.
      </p>
      <div class="video-creation-form__success-step__actions">
        <common-button
          :to="videoLink!"
          design="primary"
          alignment="center"
        >
          Перейти к видео
        </common-button>
        <common-button
          @click="resetForm()"
          design="secondary"
          alignment="center"
        >
          Загрузить еще видео
        </common-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Core } from '@/core/Core'
import type { Video } from '@/core/data/entities/Video'
import { emptyDelta } from '@/core/utils/deltaHelpers'
import { computed, ref } from 'vue'
import type { UnsavedVideo } from './UnsavedVideo'

interface Emits {
  (event: 'video-created', video: Video): void
}

const emits = defineEmits<Emits>()

const videoService = Core.Services.Video
const uiService = Core.Services.UI

const video = ref<UnsavedVideo>(emptyVideo())
const videoLink = computed(() =>
  video.value.id ? `/nootube/video/${video.value.id}` : null
)

const step = ref<'info' | 'upload' | 'success'>('info')

async function registerVideo(file: File) {
  try {
    video.value.sizeInBytes = file.size

    const response = await videoService.createVideo({
      ...video.value,
      id: undefined
    } as any as Video)

    if (!response.data?.id || !response.data?.uploadUrl) {
      throw new Error('Не удалось создать видео')
    }

    video.value.id = response.data.id
    video.value.uploadUrl = response.data.uploadUrl
  } catch (error: any) {
    uiService.openErrorModal('Не удалось создать видео', error.message)
    step.value = 'info'
  } finally {
    step.value = 'upload'
  }
}

async function finishUpload() {
  if (!video.value.id) {
    return
  }

  try {
    await videoService.finishUpload(video.value.id, {
      showLoader: true
    })

    video.value.state = 'uploaded'
  } catch (error: any) {
    uiService.openErrorModal(
      'Не удалось завершить загрузку видео',
      error.message
    )
    step.value = 'upload'
  }
}

async function publishVideo() {
  if (!video.value.id) {
    return
  }

  try {
    await videoService.publish(video.value.id)
    step.value = 'success'
    emits('video-created', video.value as Video)
  } catch (error: any) {
    uiService.openErrorModal('Не удалось сохранить видео', error.message)
    step.value = 'upload'
  }
}

function resetForm() {
  video.value = emptyVideo()
  step.value = 'info'
}

function emptyVideo(): UnsavedVideo {
  return {
    id: null,
    title: '',
    description: emptyDelta(),
    publishedAt: new Date(),
    serviceType: 'yandex',
    uniqueIdentifier: '',
    state: 'not-uploaded',
    accessType: 'everyone',
    accessValue: null,
    sizeInBytes: 0,
    duration: 0,
    chapters: [],
    thumbnail: null,
    uploadUrl: null,
    url: null
  }
}
</script>

<style scoped lang="sass">
.video-creation-form
	padding: 1em

	:deep()
		.form-group
			padding: 1em

	&__success-step
		display: flex
		flex-direction: column
		align-items: center
		justify-content: center
		height: 100%
		min-height: 500px

		&__title
			margin-bottom: 1em

		&__actions
			display: flex
			flex-direction: column
			gap: 1em
			margin-top: 1em
</style>
