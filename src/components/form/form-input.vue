<template>
  <label
    сlass="form-input"
    v-auto-animate
  >
    <span class="form-input__label">{{ label }}</span>
    <input
      class="form-input__input"
      :class="{
        'form-input__input--error': errors.length,
        'form-input__input--readonly': readonly
      }"
      :type="type"
      v-model="model"
      :placholder="placeholder"
      :disabled="readonly"
      :min="min"
      :max="max"
      :step="step"
    />
    <span
      class="form-input__error"
      v-if="errors.length"
    >
      {{ errors[0] }}
    </span>
  </label>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

type InputValidator = (value: string | number | Date) => true | string

interface Props {
  label: string
  type: string
  placeholder?: string
  modelValue?: string | number | Date
  readonly?: boolean
  min?: number
  max?: number
  step?: number
  validators?: InputValidator[]
}

interface Emits {
  (e: 'update:modelValue', value: string | number | Date): void
}

const props = defineProps<Props>()
const emits = defineEmits<Emits>()

const errors = ref<string[]>([])

const model = computed({
  get: () => {
    if (typeof props.modelValue === 'undefined') {
      return ''
    }

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
    if (props.validators) {
      errors.value = props.validators
        .map((validator) => validator(value))
        .filter((error) => error !== true) as string[]
    }

    if (props.type === 'date' || props.type === 'datetime-local') {
      emits('update:modelValue', new Date(value))
    } else if (props.type === 'number') {
      emits('update:modelValue', Number(value))
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
    height: 2.5em
    box-sizing: border-box
    font-family: inherit
    width: 100%
    min-width: 100%
    background: var(--form-background)
    color: var(--form-text-color)
    font-size: 1em
    display: block
    font-size: 1em

    &:focus
      border-color: var(--primary)

    &--error
      border-color: var(--danger) !important

    &--readonly
      background: var(--light)
      opacity: 0.7

  &__error
    font-size: 0.8rem
    color: var(--danger)
    margin-top: 0.2em
    line-height: 0.95em
    display: block
</style>
