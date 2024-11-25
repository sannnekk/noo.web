<template>
  <div class="yandex-video-block">
    <pre>
			{{ props.video }}
		</pre
    >
  </div>
</template>

<script setup lang="ts">
import type { Video } from '@/core/data/entities/Video'

interface Props {
  video: Video
}

const props = defineProps<Props>()
</script>

<style scoped lang="sass"></style>
