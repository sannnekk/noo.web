<template>
  <sure-modal
    v-model:visible="visibilityModel"
    @confirm="onConfirm()"
  >
    <template #title>
      <h2>Смена аватарки</h2>
    </template>
    <template #text>
      <div
        class="change-avatar-modal__content"
        v-auto-animate
      >
        <p class="change-avatar-modal__content__hint">
          Вы можете загрузить свою аватарку или использовать аватарку из
          Telegram, если у Вас привязан Telegram и настройки конфиденциальности
          позволяют видеть её всем.
        </p>
        <div class="change-avatar-modal__content__use-telegram">
          <form-checkbox
            v-model="data.useTelegramAvatar"
            label="Использовать аватарку из Telegram"
          />
        </div>
        <div
          class="change-avatar-modal__content__upload"
          v-if="!data.useTelegramAvatar"
        >
          <file-input
            label="Загрузить аватарку"
            v-model="data.media"
            :allowed-mime-types="['image/png', 'image/jpeg']"
            :max-count="1"
          />
        </div>
      </div>
    </template>
  </sure-modal>
</template>

<script setup lang="ts">
import type { Media } from '@/core/data/entities/Media'
import { computed, reactive } from 'vue'

export interface AvatarData {
  media: Media[]
  useTelegramAvatar: boolean
}

interface Props {
  existingAvatarMedia: Media | null
  visible: boolean
}

interface Emits {
  (event: 'update:visible', value: boolean): void
  (event: 'confirm', data: AvatarData): void
}

const props = defineProps<Props>()
const emits = defineEmits<Emits>()

const visibilityModel = computed({
  get: () => props.visible,
  set: (value) => emits('update:visible', value)
})

const data = reactive<AvatarData>({
  media: props.existingAvatarMedia ? [props.existingAvatarMedia] : [],
  useTelegramAvatar: false
})

function onConfirm() {
  emits('confirm', data)
}
</script>

<style scoped lang="sass">
.change-avatar-modal
	&__content
		&__upload
			margin-top: 1em
</style>
