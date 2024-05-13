<template>
  <div class="select-input">
    <label class="select-input__label">
      <span class="select-input__label-text">{{ label }}</span>
      <select
        :disabled="readonly"
        class="select-input__select"
        v-model="model"
      >
        <option
          v-for="option in options"
          :key="option.value"
          :value="option.value"
        >
          {{ option.label }}
        </option>
      </select>
    </label>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  label: string
  options: {
    label: string
    value: string | number
  }[]
  modelValue: string
  readonly?: boolean
}

interface Emits {
  (e: 'update:modelValue', value: string): void
}

const props = defineProps<Props>()
const emits = defineEmits<Emits>()

const model = computed({
  get: () => props.modelValue,
  set: (value) => emits('update:modelValue', value)
})
</script>

<style scoped lang="sass">
.select-input
  &__label
    font-size: 0.8em
    color: var(--text-light)

  &__label-text
    margin-right: 0.5em

  &__select
    border: 1px solid var(--border-color)
    border-radius: var(--border-radius)
    outline: none
    padding: 0.4em 0.8em
    font-family: inherit
    width: 100%
    background: var(--form-background)
    color: var(--form-text-color)

    &:focus
      border-color: var(--primary)
</style>
