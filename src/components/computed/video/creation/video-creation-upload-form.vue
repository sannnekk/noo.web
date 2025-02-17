<template>
  <div class="video-creation-upload-form">
    <yandex-video-uploader
      v-if="serviceType === 'yandex'"
      :upload-url="uploadUrl"
      @before-upload="$emit('before-upload', $event)"
      @upload-finished="onUploadFinish()"
    />
    <div class="video-creation-upload-form__actions">
      <common-button
        v-if="uploadFinished"
        @click="$emit('publish')"
        design="primary"
        alignment="right"
      >
        Опубликовать видео
      </common-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Video } from '@/core/data/entities/Video'
import { ref } from 'vue'

interface Props {
  uploadUrl: string | null
  serviceType: Video['serviceType']
}

interface Emits {
  (event: 'publish'): void
  (event: 'before-upload', file: File): void
  (event: 'finish-upload'): void
}

defineProps<Props>()
const emits = defineEmits<Emits>()

const uploadFinished = ref(false)

const onUploadFinish = () => {
  uploadFinished.value = true

  emits('finish-upload')
}
</script>
