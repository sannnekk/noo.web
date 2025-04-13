<template>
  <div class="yandex-video-player">
    <div
      class="yandex-video-player__player-root"
      ref="playerRef"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import type { Video } from '@/core/data/entities/Video'

interface Props {
  video: Video
  autoplay?: boolean
}

const props = defineProps<Props>()

const sourceLink = computed(
  () =>
    `https://runtime.video.cloud.yandex.net/player/video/${props.video.uniqueIdentifier}`
)

const playerRef = ref<HTMLElement | null>(null)
let player: any = null

onMounted(() => {
  // @ts-ignore
  player = Ya.playerSdk.init({
    element: playerRef.value,
    source: sourceLink.value,
    autoplay: props.autoplay || false
  })
})

onUnmounted(() => {
  if (player) {
    player.destroy()
  }
})
</script>

<style scoped lang="sass">
.yandex-video-player
	width: 100%
	height: 100%
	border-radius: var(--border-radius)
	overflow: hidden

	&__player-root
		width: 100%
		height: 100%

		&:deep()
			.jn502d-
				background: var(--lila) !important

			._2iJDT4A
				fill: var(--lila) !important
</style>
