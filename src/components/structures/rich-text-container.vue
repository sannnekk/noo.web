<template>
  <div class="rich-text-container">
    <QuillEditor
      :read-only="true"
      :content="model"
      :toolbar="[]"
      theme="snow"
      content-type="delta"
    />
  </div>
</template>

<script setup lang="ts">
import type { DeltaContentType } from '@/types/composed/DeltaContentType'
import { Delta, QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import { computed } from 'vue'

interface Props {
  content: DeltaContentType
}

const props = defineProps<Props>()

const model = computed(() => new Delta(props.content))
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
