<template>
  <div
    class="yandex-video-uploader"
    v-auto-animate
  >
    <label
      class="yandex-video-uploader__drop-region"
      :class="{ 'yandex-video-uploader__drop-region--drag': isDragActive }"
      v-if="!fileRef"
      :for="componentId"
      @dragenter.prevent="onDragEnter()"
      @dragleave.prevent="onDragLeave()"
      @dragover.prevent
      @mouseleave="onDragLeave()"
      @drop.prevent="onFilesDropped($event)"
    >
      <h3 class="yandex-video-uploader__drop-region__label">
        Кликните или перетащите файл сюда
      </h3>
      <p class="yandex-video-uploader__drop-region__hint">
        Допустимые форматы: {{ allowedMimeTypesString }}
      </p>
      <input
        :id="componentId"
        hidden
        type="file"
        @change="onFileSelected($event)"
        :accept="config.allowedFormats.join(', ')"
      />
    </label>
    <div
      class="yandex-video-uploader__uploader"
      v-if="uploading || fileRef"
    >
      <div
        class="yandex-video-uploader__uploader__progress"
        v-if="!error"
      >
        <h1>{{ progress }}%</h1>
        <progress-bar :value="progress" />
      </div>
      <div
        class="yandex-video-uploader__uploader__actions"
        v-if="!error"
      >
        <common-button
          design="inline"
          @click="pauseUpload()"
          v-if="!isPaused && uploading"
        >
          Пауза
        </common-button>
        <common-button
          design="primary"
          @click="resumeUpload()"
          v-if="isPaused"
        >
          Продолжить
        </common-button>
        <common-button
          design="danger"
          @click="cancelUpload()"
        >
          Отменить
        </common-button>
      </div>
      <div
        class="yandex-video-uploader__uploader__error"
        v-if="error"
      >
        <error-block>
          <h3>Ошибка загрузки</h3>
          <p>
            {{ error }}
          </p>
        </error-block>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { Upload, type UploadOptions } from 'tus-js-client'
import { v4 as uuid } from 'uuid'

interface Props {
  uploadUrl: string | null
}

interface Emits {
  (event: 'before-upload', file: File): void
  (event: 'upload-finished'): void
  (event: 'error'): void
}

const props = defineProps<Props>()
const emits = defineEmits<Emits>()

const config = {
  /**
   * A size in bytes for the data chunks that are uploaded to the server.
   */
  chunkSize: 5 * 1024 * 1024,
  /**
   * Video formats that are allowed (mp4, avi, mkv, flv and mov)
   */
  allowedFormats: ['video/mp4', 'video/avi', 'video/mov']
} as const

const allowedMimeTypesString = config.allowedFormats
  .map((format) => format.split('/')[1])
  .join(', ')

const componentId = `yandex-uploader-${uuid()}`
const fileRef = ref<File | null>(null)
const upload = ref<Upload | null>(null)
const uploading = ref(false)
const progress = ref(0)
const isPaused = ref(false)
const error = ref<any | null>(null)

let dragTimeoutId = 0
const isDragActive = ref(false)

function onDragEnter() {
  isDragActive.value = true
  clearTimeout(dragTimeoutId)
}

function onDragLeave() {
  dragTimeoutId = setTimeout(() => {
    isDragActive.value = false
  }, 50) as any
}

function onFilesDropped(event: DragEvent) {
  const files = Array.from(event.dataTransfer?.files || [])

  if (files && files[0] && fileFormatIsValid(files[0])) {
    fileRef.value = files[0]

    emits('before-upload', fileRef.value)
  }
}

function onFileSelected(event: Event): void {
  const target = event.target as HTMLInputElement
  const files = target.files

  if (files && files[0] && fileFormatIsValid(files[0])) {
    fileRef.value = files[0]

    emits('before-upload', fileRef.value)
  }
}

watch(
  () => props.uploadUrl,
  () => {
    if (props.uploadUrl) {
      startUpload()
    }
  }
)

function startUpload(): void {
  if (!fileRef.value || !props.uploadUrl) {
    return
  }

  uploading.value = true

  const options: UploadOptions = {
    uploadUrl: props.uploadUrl,
    chunkSize: config.chunkSize,
    metadata: {
      filename: fileRef.value.name,
      filetype: fileRef.value.type
    },
    onError: (e) => {
      uploading.value = false
      error.value = e
      emits('error')
    },
    onProgress: (bytesUploaded: number, bytesTotal: number) => {
      progress.value = Math.floor((bytesUploaded / bytesTotal) * 100)
    },
    onSuccess: () => {
      uploading.value = false
      emits('upload-finished')
    },
    retryDelays: [0, 1000, 3000, 5000] // Retry delays in milliseconds
  }

  upload.value = new Upload(fileRef.value, options)
  upload.value?.start()
}

function pauseUpload(): void {
  isPaused.value = true

  if (upload.value) {
    upload.value.abort()
  }
}

function resumeUpload(): void {
  if (upload.value) {
    isPaused.value = false
    upload.value.start()
  } else {
    startUpload()
  }
}

function cancelUpload(): void {
  if (upload.value) {
    upload.value.abort()
    upload.value = null
    uploading.value = false
    progress.value = 0
    fileRef.value = null
    isPaused.value = false
  }
}

function fileFormatIsValid(file: File): boolean {
  return config.allowedFormats.includes(file.type as any)
}
</script>

<style scoped lang="sass">
.yandex-video-uploader
	&__drop-region
		display: flex
		flex-direction: column
		align-items: center
		justify-content: center
		height: 400px
		border: 1px dashed var(--text-light)
		border-radius: var(--border-radius)
		padding: 16px
		cursor: pointer
		transition: border-color 0.3s

		&:hover
			border: 1px solid var(--primary)

		&--drag
			border: 1px solid var(--primary)

		*
			pointer-events: none

		&__label
			font-size: 1.5rem
			color: var(--dark-text-color)
			margin-bottom: 8px

		&__hint
			font-size: 1rem
			color: var(--text-light)
			margin-bottom: 0

	&__uploader
		display: flex
		flex-direction: column
		align-items: center
		justify-content: center
		min-height: 300px
		text-align: center

		&__progress
			width: 80%
			margin-bottom: 16px

		&__actions
			display: flex
			gap: 16px
			margin-top: 16px

		&__error
			width: 80%
			margin-top: 16px
</style>
