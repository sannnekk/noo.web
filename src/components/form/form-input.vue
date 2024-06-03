<template>
  <label сlass="form-input">
    <span class="form-input__label">{{ label }}</span>
    <input
      class="form-input__input"
      :type="type"
      v-model="model"
      :placholder="placeholder"
      :disabled="readonly"
      :min="min"
      :max="max"
      :step="step"
    />
  </label>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  label: string
  type: string
  placeholder?: string
  modelValue: string | number | Date
  readonly?: boolean
  min?: number
  max?: number
  step?: number
}

interface Emits {
  (e: 'update:modelValue', value: string | number | Date): void
}

const props = defineProps<Props>()
const emits = defineEmits<Emits>()

const model = computed({
  get: () => {
    if (props.type && props.type === 'date') {
      return new Date(props.modelValue).toISOString().slice(0, 10)
    } else if (props.type && props.type === 'datetime-local') {
      const date = new Date(props.modelValue)
      return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 16)
    }

    return props.modelValue
  },
  set: (value) => {
    if (props.type === 'date' || props.type === 'datetime-local') {
      emits('update:modelValue', new Date(value))
    } else {
      emits('update:modelValue', value)
    }
  }
})
</script>

<style scoped lang="sass">
.form-input
  &__label
    font-size: 0.8rem
    color: var(--text-light)

  &__input
    border: 1px solid var(--border-color)
    border-radius: var(--border-radius)
    outline: none
    padding: 0.5em 0.8em
    font-family: inherit
    width: 100%
    background: var(--form-background)
    color: var(--form-text-color)
    font-size: 1em

    &:focus
      border-color: var(--primary)
</style>
