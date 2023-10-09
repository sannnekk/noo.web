<template>
  <input
    class="inline-input"
    v-model="model"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  modelValue: string
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
.inline-input
  border: none
  outline: none
  padding: 0
  border-radius: 0
  font-family: inherit

  &:focus
    box-shadow: none
    border-bottom: 1px solid var(--secondary)
</style>
