<template>
  <div
    class="add-video-to-saved-button"
    @click="onClick()"
    :class="state"
  >
    <span v-if="state === 'added'">
      <inline-icon name="check-green" />
      <span class="add-video-to-saved-button__text">Добавлено в избранное</span>
    </span>
    <span v-else-if="state === 'not-added'">
      <inline-icon name="add" />
      <span class="add-video-to-saved-button__text">Добавить в избранное</span>
    </span>
    <span v-else>
      <loader-icon contrast />
    </span>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import { Core } from '@/core/Core'
import type { Video } from '@/core/data/entities/Video'

interface Props {
  videoId: Video['id']
}

const props = defineProps<Props>()

const videoService = Core.Services.Video
const uiService = Core.Services.UI

const state = ref<'added' | 'not-added' | 'loading'>('loading')

watch(
  () => props.videoId,
  async () => {
    await getState()
  },
  { immediate: true }
)

async function onClick() {
  if (state.value === 'loading') {
    return
  }

  const previousState = state.value

  state.value = 'loading'

  try {
    if (previousState === 'added') {
      await videoService.removeFromSavedVideos(props.videoId)
      state.value = 'not-added'
    } else {
      await videoService.addToSavedVideos(props.videoId)
      state.value = 'added'
    }
  } catch (error: any) {
    uiService.openErrorModal(
      'Не удалось добавить или убрать видео в избранное',
      error.message
    )
  } finally {
    if (state.value === 'loading') {
      state.value = previousState
    }
  }
}

async function getState() {
  try {
    const response = await videoService.isSaved(props.videoId)
    state.value = response.data ? 'added' : 'not-added'
  } catch (error) {
    state.value = 'not-added'
  }
}
</script>

<style lang="sass" scoped>
.add-video-to-saved-button
  display: inline-block
  padding: 0.4em 0.8em
  border-radius: var(--border-radius)
  border: 1px solid var(--border-color)
  cursor: pointer

  span
    display: flex
    align-items: center
    gap: 0.5em

  &:hover
    border-color: var(--lila)

  &.added
    border-color: var(--success)
</style>
