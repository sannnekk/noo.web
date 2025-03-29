<template>
  <sure-modal
    v-model:visible="visibilityModel"
    type="info"
    @confirm="onConfirm()"
    :confirm-disabled="!isValid"
  >
    <template #title>Редактирование "{{ video.title }}"</template>
    <template #text>
      <video-update-form
        v-model:video="videoModel"
        v-model:valid="isValid"
      />
    </template>
  </sure-modal>
</template>

<script lang="ts" setup>
import { deepCopy } from '@/core/utils/object'
import { Core } from '@/core/Core'
import { computed, ref } from 'vue'
import type { Video } from '@/core/data/entities/Video'

interface Props {
  visible: boolean
  video: Video
}

interface Emits {
  (event: 'update:visible', visible: boolean): void
  (event: 'edited', video: Video): void
}

const props = defineProps<Props>()
const emits = defineEmits<Emits>()

const videoService = Core.Services.Video
const uiService = Core.Services.UI

const videoModel = ref(deepCopy(props.video, false))

const visibilityModel = computed({
  get: () => props.visible,
  set: (value: boolean) => emits('update:visible', value)
})

const isValid = ref(true)

async function onConfirm() {
  if (!isValid.value) {
    return
  }

  try {
    await videoService.updateVideo(videoModel.value.id, videoModel.value, {
      showLoader: true
    })

    emits('edited', videoModel.value)
  } catch (error: any) {
    uiService.openErrorModal('Ошибка при обновлении видео', error.message)
  }
}
</script>

<style lang="sass"></style>
