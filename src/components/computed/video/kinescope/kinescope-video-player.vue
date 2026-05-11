<template>
  <div class="kinescope-video-player">
    <kinescope-player
      class="kinescope-video-player__player"
      :video-id="props.video.uniqueIdentifier"
      :auto-play="props.autoplay || false"
      width="100%"
      height="100%"
      language="ru"
    />
  </div>
</template>

<script setup lang="ts">
import type { Video } from '@/core/data/entities/Video'
import { KinescopePlayer } from '@kinescope/vue-kinescope-player'

interface Props {
  video: Video
  autoplay?: boolean
}

const props = defineProps<Props>()
</script>

<style scoped lang="sass">
.kinescope-video-player
  width: 100%
  height: 100%
  border-radius: var(--border-radius)
  overflow: hidden

  &__player
    width: 100%
    height: 100%

    :deep()
      .kinescope-video-player__player > div
        height: 100%
</style>
