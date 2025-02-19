<template>
  <work-select
    label="Выберите работу"
    v-model="workModel"
  />
</template>

<script setup lang="ts">
import type { TableCell } from '@/core/data/entities/TableCell'
import type { Work } from '@/core/data/entities/Work'
import { computed, ref, watch } from 'vue'

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

const workModel = computed({
  get: () => (props.modelValue.metadata as Work) || null,
  set: (work) => {
    emits('update:modelValue', {
      ...props.modelValue,
      value: work?.id || '',
      metadata: ref(work) || null
    })
  }
})

const isValidModel = computed({
  get: () => props.isValid,
  set: (value) => emits('update:isValid', value)
})

watch(workModel, validate, { immediate: true })

function validate() {
  if (!workModel.value) {
    isValidModel.value = [false, 'Необходимо выбрать работу']
  } else {
    isValidModel.value = [true]
  }
}
</script>
