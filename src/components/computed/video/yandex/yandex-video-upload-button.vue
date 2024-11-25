<template>
  <div class="yandex-video-upload-button">
    <input
      v-if="!fileRef"
      type="file"
      @change="onFileSelected($event)"
      :accept="config.allowedFormats.join(', ')"
    />
    <div v-if="uploading || fileRef">
      <progress-bar :value="progress" />
      <p>{{ progress }}%</p>
      <common-button
        design="inline"
        @click="pauseUpload"
        v-if="!isPaused && uploading"
      >
        Pause
      </common-button>
      <common-button
        design="primary"
        @click="resumeUpload"
        v-if="isPaused"
      >
        Resume
      </common-button>
      <common-button
        design="danger"
        @click="cancelUpload()"
      >
        Cancel
      </common-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import tus, { Upload } from 'tus-js-client'
import type { Video } from '@/core/data/entities/Video'

interface Props {
  uploadUrl: string | null
  state: Video['state']
}

interface Emits {
  (event: 'before-upload', file: File): void
  (event: 'upload-finished'): void
  (event: 'error'): void
}

const props = defineProps<Props>()
const emits = defineEmits<Emits>()

watch(
  () => props.state,
  (state) => {
    if (state === 'uploading') {
      startUpload()
    }
  }
)

const config = {
  /**
   * A size in bytes for the data chunks that are uploaded to the server.
   */
  chunkSize: 5 * 1024 * 1024,
  /**
   * Video formats that are allowed (mp4, avi, mkv, flv and mov)
   */
  allowedFormats: [
    'video/mp4',
    'video/avi',
    'video/mkv',
    'video/flv',
    'video/mov'
  ]
} as const

const fileRef = ref<File | null>(null)
const upload = ref<Upload | null>(null)
const uploading = ref(false)
const progress = ref(0)
const isPaused = ref(false)

function onFileSelected(event: Event): void {
  const target = event.target as HTMLInputElement
  const files = target.files

  if (files && files[0] && fileFormatIsValid(files[0])) {
    fileRef.value = files[0]
    startUpload()
  }
}

function startUpload(): void {
  if (!fileRef.value || !props.uploadUrl) {
    return
  }

  uploading.value = true

  const options: tus.UploadOptions = {
    uploadUrl: props.uploadUrl || undefined,
    chunkSize: config.chunkSize,
    metadata: {
      filename: fileRef.value.name,
      filetype: fileRef.value.type
    },
    onError: () => {
      uploading.value = false
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

  upload.value = new tus.Upload(fileRef.value, options)
  upload.value.start()
}

function pauseUpload(): void {
  if (upload.value) {
    upload.value.abort()
    isPaused.value = true
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

<style scoped lang="sass"></style>
