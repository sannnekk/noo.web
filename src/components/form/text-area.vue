<template>
  <textarea
    class="textarea"
    :placeholder="placeholder"
    v-model="model"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
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
.textarea
  width: 100%
  padding: 1rem 1rem
  border-radius: 1.35rem
  border: 1px solid var(--text-light)
  outline: none
  transition: border-color 0.2s ease-in-out
  resize: vertical
  font-family: inherit
  min-height: 5em

  &:focus
    outline: none
    border-color: var(--secondary)
    box-shadow: 0px 0px 5px var(--secondary)
</style>
