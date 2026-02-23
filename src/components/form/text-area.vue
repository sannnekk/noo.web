<template>
  <div class="text-area">
    <label
      class="text-area__label"
      v-if="label"
      >{{ label }}</label
    >
    <textarea
      class="text-area__textarea"
      :class="{
        'text-area__textarea--readonly': readonly,
        'text-area__textarea--error': !!errors.length
      }"
      :placeholder="placeholder"
      v-model="model"
      :readonly="readonly"
      @focusin="() => (errors.length = 0)"
      @focusout="() => (errors.length = 0)"
    />
    <span
      class="text-area__error"
      v-if="errors.length"
    >
      {{ errors[0] }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'

type InputValidator = (value: string | number | Date) => true | string

interface Props {
  label?: string
  modelValue: string
  placeholder?: string
  validators?: InputValidator[]
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

const errors = ref<string[]>([])

watch(model, () => {
  errors.value = []

  if (props.validators) {
    for (const validator of props.validators) {
      const result = validator(model.value)
      if (result !== true) {
        errors.value.push(result as string)
      }
    }
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

    &--readonly
      background: var(--light-background-color)
      color: var(--text-light)

    &--error
      border-color: var(--danger) !important

    &:focus
      outline: none
      border-color: var(--primary)

  &__error
    font-size: 0.8rem
    color: var(--danger)
    margin-top: 0.2em
    line-height: 0.95em
    display: block
</style>
