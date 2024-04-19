<template>
  <div class="text-area">
    <label
      class="text-area__label"
      v-if="label"
      >{{ label }}</label
    >
    <textarea
      class="text-area__textarea"
      :placeholder="placeholder"
      v-model="model"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  label?: string
  modelValue: string
  placeholder?: string
}

interface Emits {
  (e: 'update:modelValue', value: string): void
}

const props = defineProps<Props>()
const emits = defineEmits<Emits>()

const model = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emits('update:modelValue', value)
  }
})
</script>

<style scoped lang="sass">
.text-area
  &__label
    font-size: 0.8em
    color: var(--text-light)

  &__textarea
    width: 100%
    padding: 1rem 1rem
    border-radius: var(--border-radius)
    border: 1px solid var(--border-color)
    outline: none
    transition: border-color 0.2s ease-in-out
    resize: vertical
    font-family: inherit
    min-height: 5em
    color: var(--form-text-color)
    background: var(--form-background)

    &:focus
      outline: none
      border-color: var(--primary)
</style>
