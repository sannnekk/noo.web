<template>
  <div class="rich-text-container">
    <quill-editor
      :model-value="content"
      :readonly="true"
      :commentable="commentable"
      @commented="emits('commented', $event)"
    />
  </div>
</template>

<script setup lang="ts">
import type { DeltaContentType } from '@/types/composed/DeltaContentType'

interface Props {
  content: DeltaContentType
  commentable?: boolean
}

interface Emits {
  (e: 'commented', value: DeltaContentType): void
}

const props = defineProps<Props>()
const emits = defineEmits<Emits>()
</script>
