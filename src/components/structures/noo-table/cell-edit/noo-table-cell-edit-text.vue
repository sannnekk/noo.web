<template>
  <form-input
    type="text"
    label="Значение ячейки"
    v-model="valueModel.value"
  />
</template>

<script setup lang="ts">
import type { TableCell } from '@/core/data/entities/TableCell'
import { computed, watch } from 'vue'

interface Props {
  modelValue: TableCell
  isValid: [boolean, string?]
}

interface Emits {
  (event: 'update:modelValue', value: TableCell): void
  (event: 'update:isValid', value: [boolean, string?]): void
}

const props = defineProps<Props>()
const emits = defineEmits<Emits>()

const valueModel = computed({
  get: () => props.modelValue,
  set: (value) => emits('update:modelValue', value)
})

const isValidModel = computed({
  get: () => props.isValid,
  set: (value) => emits('update:isValid', value)
})

watch(valueModel, validate, { immediate: true, deep: true })

function validate() {
  if (!valueModel.value.value) {
    isValidModel.value = [false, 'Необходимо заполнить значение ячейки']
  } else {
    isValidModel.value = [true]
  }
}
</script>
