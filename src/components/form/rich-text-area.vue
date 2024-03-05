<template>
  <div class="rich-text-area">
    <label>{{ label }}</label>
    <div class="rich-text-area__inner">
      <quill-editor v-model="model" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { DeltaContentType } from '@/types/composed/DeltaContentType'
import { computed } from 'vue'

interface Props {
  modelValue: DeltaContentType
  label?: string
}

interface Emits {
  (e: 'update:modelValue', value: DeltaContentType): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const model = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  }
})
</script>

<style scoped lang="sass">
.rich-text-area
  label
    font-size: 0.8em
    color: var(--text-light)

  &__inner
    border-radius: var(--border-radius)
    border: 1px solid var(--border-color)

  &:deep()
    .ql-toolbar.ql-snow
      border: none
      border-bottom: 1px solid var(--border-color)

    .ql-container.ql-snow
      border: none

      .ql-editor
        font-size: 1rem
        font-family: var(--font-family)
</style>
