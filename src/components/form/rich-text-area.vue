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
    .ql-snow .ql-tooltip
      border: none
      border-radius: var(--border-radius)
      background-color: var(--form-background)
      color: var(--form-text-color)
      box-shadow: 0 0 5px rgba(0, 0, 0, 0.1)

      input
        color: var(--form-text-color)
        background-color: var(--form-background)
        border: 1px solid var(--border-color)
        border-radius: var(--border-radius)

      .ql-action
        color: var(--lila)
        cursor: pointer
        font-weight: bold

        &:hover
          color: var(--form-text-color)


    .ql-toolbar.ql-snow
      border: none
      border-bottom: 1px solid var(--border-color)

      .ql-stroke
        stroke: var(--form-text-color)

      .ql-fill
        fill: var(--form-text-color)

      .ql-picker-label
        color: var(--form-text-color)

      .ql-formats
        > button, span
          border: 1px solid transparent

          .ql-picker-options
            background-color: var(--form-background)
            border: none
            border-radius: var(--border-radius)
            border: 1px solid var(--border-color)
            box-shadow: 0 0 5px rgba(0, 0, 0, 0.1)

          .ql-picker-item
            color: var(--form-text-color) !important

            .ql-stroke
              stroke: var(--form-text-color) !important

            .ql-fill
              fill: var(--form-text-color) !important

            &:hover
              .ql-stroke
                stroke: var(--lila) !important

              .ql-fill
                fill: var(--lila) !important

              .ql-picker-label
                color: var(--lila) !important

          &:hover
            .ql-stroke
              stroke: var(--lila)

            .ql-fill
              fill: var(--lila)

            .ql-picker-label
              color: var(--lila) !important

        .ql-active
          .ql-stroke
            stroke: var(--lila)

          .ql-fill
            fill: var(--lila)

          .ql-picker-label
            color: var(--lila) !important

    .ql-container.ql-snow
      border: none

      .ql-editor
        font-size: 1rem
        font-family: var(--font-family)
</style>
