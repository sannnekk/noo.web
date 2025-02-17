<template>
  <div class="video-comment-form">
    <div class="video-comment-form__input">
      <text-area
        label="Оставить комментарий"
        v-model="content"
        :validators="[
					(value: any) => !value || 'Комментарий не может быть пустым',
					(value: any) => value.length <= maxLength || 'Комментарий слишком длинный'
				]"
        :readonly="isLoading"
      />
    </div>
    <div class="video-comment-form__actions">
      <common-button
        @click="onSubmit()"
        design="primary"
        alignment="right"
        :loading="isLoading"
      >
        Отправить
      </common-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Core } from '@/core/Core'
import { computed, ref } from 'vue'

interface Props {
  videoId: string
}

interface Emits {
  (event: 'comment-created'): void
}

const props = defineProps<Props>()
const emits = defineEmits<Emits>()

const videoService = Core.Services.Video
const uiService = Core.Services.UI

const maxLength = 250
const content = ref('')
const trimmed = computed(() => content.value.trim())
const isLoading = ref(false)

async function onSubmit() {
  if (!trimmed.value || trimmed.value.length > maxLength) return

  isLoading.value = true

  try {
    await videoService.createComment(props.videoId, trimmed.value)
    content.value = ''
    emits('comment-created')
  } catch (error: any) {
    uiService.openErrorModal('Не удалось отправить комментарий', error.message)
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped lang="sass">
.video-comment-form
	&__actions
		font-size: 0.8em
</style>
