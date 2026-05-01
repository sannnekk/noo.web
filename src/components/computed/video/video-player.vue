<template>
  <component
    :is="component"
    :video="video"
  />
</template>

<script setup lang="ts">
import type { Video } from '@/core/data/entities/Video'
import { computed } from 'vue'
import YandexVideoPlayer from './yandex/yandex-video-player.vue'
import KinescopeVideoPlayer from './kinescope/kinescope-video-player.vue'

interface Props {
  video: Video
}

const props = defineProps<Props>()

const component = computed(() => {
  switch (props.video.serviceType) {
    case 'kinescope':
      return KinescopeVideoPlayer
    case 'yandex':
    default:
      return YandexVideoPlayer
  }
})
</script>
