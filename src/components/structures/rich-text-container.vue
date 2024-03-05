<template>
  <div class="rich-text-container">
    <quill-editor
      :model-value="content"
      :readonly="true"
    />
  </div>
</template>

<script setup lang="ts">
import type { DeltaContentType } from '@/types/composed/DeltaContentType'

interface Props {
  content: DeltaContentType
}

defineProps<Props>()
</script>

<style scoped lang="sass">
.rich-text-container
  &:deep()
    .ql-toolbar.ql-snow
      display: none
    .ql-container.ql-snow
      border: none

      .ql-editor
        font-size: 1rem
        padding: 0
        font-family: var(--font-family)
</style>
