<template>
  <div class="rich-text-container">
    <quill-editor
      :model-value="content"
      :readonly="true"
      :commentable="commentable"
      :comment-types="commentTypes"
      @commented="$emit('commented', $event)"
      @custom-commented="$emit('custom-commented', $event)"
      @custom-comment-deleted="$emit('custom-comment-deleted', $event)"
    />
  </div>
</template>

<script setup lang="ts">
import type { DeltaContentType } from '@/types/composed/DeltaContentType'

interface Props {
  content: DeltaContentType
  commentable?: boolean
  commentTypes?: string[]
}

interface Emits {
  (e: 'commented', value: DeltaContentType): void
  (e: 'custom-commented', value: string): void
  (e: 'custom-comment-deleted', value: string): void
}

defineProps<Props>()
defineEmits<Emits>()
</script>
