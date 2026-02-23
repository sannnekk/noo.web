<template>
  <select-input
    :label="label"
    :options="workTypeOptions"
    v-model="workTypeModel"
  />
</template>

<script setup lang="ts">
import type { Work } from '@/core/data/entities/Work'
import { computed } from 'vue'

interface Props {
  label: string
  modelValue: Work['type']
}

interface Emits {
  (event: 'update:modelValue', value: Work['type']): void
}

const props = defineProps<Props>()
const emits = defineEmits<Emits>()

const workTypeModel = computed<Work['type']>({
  get: () => props.modelValue,
  set: (value) => emits('update:modelValue', value)
})

const workTypeOptions = [
  {
    value: 'trial-work',
    label: 'Пробник'
  },
  {
    value: 'mini-test',
    label: 'Мини-зачет'
  },
  {
    value: 'test',
    label: 'Тест'
  },
  {
    value: 'second-part',
    label: 'Вторая часть'
  },
  {
    value: 'phrase',
    label: 'Фраза'
  }
]
</script>
