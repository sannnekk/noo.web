<template>
  <label
    сlass="form-input"
    v-auto-animate
  >
    <span class="form-input__label">{{ label }}</span>
    <div class="form-input__input-container">
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
      <div
        v-if="copyButton"
        class="form-input__copy-button"
        title="Копировать"
        @click="onCopy()"
      >
        <inline-icon
          :name="copyIcon"
          :key="copyIcon"
        />
      </div>
    </div>
    <span
      class="form-input__error"
      v-if="errors.length"
    >
      {{ errors[0] }}
    </span>
  </label>
</template>

<script setup lang="ts">
import { copyText } from '@/core/device/Clipboard'
import { computed, ref } from 'vue'
import type { IconName } from '../decorations/inline-icon.vue'

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
  copyButton?: boolean
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

const copyIcon = ref<IconName>('copy')

function onCopy() {
  copyText(String(model.value || ''))
  copyIcon.value = 'check-green'

  setTimeout(() => {
    copyIcon.value = 'copy'
  }, 1000)
}
</script>

<style scoped lang="sass">
.form-input
  &__label
    font-size: 0.8rem
    color: var(--text-light)

  &__input-container
    position: relative

    &:hover
      .form-input__copy-button
        visibility: visible

  &__copy-button
    position: absolute
    right: 0.2em
    top: 50%
    transform: translateY(-50%)
    font-size: 1.2em
    display: flex
    align-items: center
    justify-content: center
    visibility: hidden
    cursor: pointer
    background-color: var(--form-background)
    border-radius: 50%
    padding: 0.2em

    &:hover
      background-color: var(--border-color)

  &__input
    border: 1px solid var(--border-color)
    border-radius: var(--border-radius)
    outline: none
    padding: 0.5em 0.8em
    box-sizing: border-box
    font-family: inherit
    width: 100%
    min-width: 100%
    max-width: 100%
    background: var(--form-background)
    color: var(--form-text-color)
    display: block
    font-size: 0.9em
    line-height: 1
    height: 2.4em

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
