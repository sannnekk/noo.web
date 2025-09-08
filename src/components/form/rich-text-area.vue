<template>
  <div class="rich-text-area">
    <label>{{ label }}</label>
    <div class="rich-text-area__inner">
      <quill-editor
        v-model="model"
        v-model:cursor-position="cursorPosition"
        :font-size="userSettingsStore.fontSize"
        :snippets="snippets"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { DeltaContentType } from '@/types/composed/DeltaContentType'
import { computed } from 'vue'
import { Core } from '@/core/Core'
import type { Snippet } from '@/core/data/entities/Snippet'

interface Props {
  modelValue: DeltaContentType
  cursorPosition?: number
  label?: string
  snippets?: Snippet[]
}

interface Emits {
  (e: 'update:modelValue', value: DeltaContentType): void
  (e: 'update:cursorPosition', value?: number): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const userSettingsService = Core.Services.UserSettings
const userSettingsStore = userSettingsService.Store()

const model = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  }
})

const cursorPosition = computed({
  get() {
    return props.cursorPosition
  },
  set(value) {
    emit('update:cursorPosition', value)
  }
})
</script>

<style scoped lang="sass">
.rich-text-area
  label
    font-size: 0.8em
    color: var(--text-light)

  &__inner
    border: 1px solid var(--border-color)
    border-radius: var(--border-radius)
</style>
