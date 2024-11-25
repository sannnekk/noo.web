<template>
  <component
    :is="component"
    :video="video"
  />
</template>

<script setup lang="ts">
import type { Video } from '@/core/data/entities/Video'
import { computed } from 'vue'

interface Props {
  video: Video
}

const props = defineProps<Props>()

const component = computed(() => {
  switch (props.video.serviceType) {
    case 'yandex':
    default:
      return import('./yandex/yandex-video-block.vue')
  }
})
</script>
