<template>
  <div
    class="rich-text-container"
    :class="{ 'no-padding': noPadding }"
  >
    <quill-editor
      :model-value="content"
      :readonly="true"
      :commentable="commentable"
      :comment-types="commentTypes"
      :allow-image-rotation="false"
      :font-size="fontSize || userSettingsStore.fontSize"
      @commented="$emit('commented', $event)"
      @custom-commented="$emit('custom-commented', $event)"
      @custom-comment-deleted="$emit('custom-comment-deleted', $event)"
    />
  </div>
</template>

<script setup lang="ts">
import type { DeltaContentType } from '@/types/richtext/DeltaContentType'
import { Core } from '@/core/Core'
import type { UserSettings } from '@/core/data/entities/UserSettings'

interface Props {
  content: DeltaContentType
  commentable?: boolean
  commentTypes?: string[]
  //allowImageRotation?: boolean
  fontSize?: UserSettings['fontSize']
  noPadding?: boolean
}

interface Emits {
  (e: 'commented', value: DeltaContentType): void
  (e: 'custom-commented', value: string): void
  (e: 'custom-comment-deleted', value: string): void
}

defineProps<Props>()
defineEmits<Emits>()

const userSettingsService = Core.Services.UserSettings
const userSettingsStore = userSettingsService.Store()
</script>

<style lang="sass" scoped>
.rich-text-container
	&.no-padding
		&:deep()
			.quill-editor__content
				padding: 0
</style>
