<template>
  <form-input
    type="text"
    label="Значение ячейки"
    v-model="cellModel.value"
  />
</template>

<script setup lang="ts">
import type { TableCell } from '@/core/data/entities/TableCell'
import { computed, watch } from 'vue'
import { TableFormula } from '../TableFormula'

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

const cellModel = computed({
  get: () => props.modelValue,
  set: (value) => emits('update:modelValue', value)
})

const isValidModel = computed({
  get: () => props.isValid,
  set: (value) => emits('update:isValid', value)
})

watch(cellModel, validate, { immediate: true, deep: true })

function validate() {
  if (TableFormula.validate(cellModel.value.value)) {
    isValidModel.value = [true]
  } else {
    isValidModel.value = [false, 'Некорректная формула']
  }
}
</script>
