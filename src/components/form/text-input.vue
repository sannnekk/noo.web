<template>
  <div class="text-input">
    <label :for="`input-${String($.uid)}`">{{ label }}</label>
    <input
      :id="`input-${String($.uid)}`"
      :type="password ? 'password' : 'text'"
      :placeholder="placeholder"
      :class="{ error }"
      v-model="model"
      @keypress.enter="$emit('enter-press')"
      :autocomplete="autocomplete ? 'on' : 'off'"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  password?: boolean
  error?: boolean
  placeholder: string
  modelValue: string
  autocomplete?: boolean
  label?: string
}

interface Emits {
  (e: 'update:modelValue', value: string): void
  (e: 'enter-press'): void
}

const props = defineProps<Props>()
const emits = defineEmits<Emits>()

const model = computed({
  get: () => props.modelValue,
  set: (val) => emits('update:modelValue', val)
})
</script>

<style scoped lang="sass">
.text-input
  label
    font-size: 0.9em
    font-weight: 400
    margin-bottom: 0.1em
    display: block
    margin-left: 1.2em

  input
    background: var(--lightest)
    border: 1px solid var(--text-light)
    border-radius: 10em
    padding: 1em 1.5em
    width: 100%
    font-family: inherit

    &:focus
      outline: none
</style>
