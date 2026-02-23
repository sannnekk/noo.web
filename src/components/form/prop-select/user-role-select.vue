<template>
  <select-input
    :label="label"
    :options="roleOptions"
    v-model="roleModel"
  />
</template>

<script setup lang="ts">
import type { VisibleRole } from '@/core/services/api/UserService'
import { ref, watch } from 'vue'

interface Props {
  label: string
  modelValue: VisibleRole | null
}

interface Emits {
  (event: 'update:modelValue', value: VisibleRole): void
}

const props = defineProps<Props>()
const emits = defineEmits<Emits>()

const roleOptions: VisibleRole[] = [
  {
    label: 'Администратор',
    value: 'admin'
  },
  {
    label: 'Преподаватель',
    value: 'teacher'
  },
  {
    label: 'Куратор',
    value: 'mentor'
  },
  {
    label: 'Ученик',
    value: 'student'
  },
  {
    label: 'Ассистент',
    value: 'assistant'
  }
]

const roleModel = ref<string>(props.modelValue?.value || roleOptions[0].value)

watch(
  () => roleModel.value,
  () =>
    emits(
      'update:modelValue',
      roleOptions.find((o) => o.value === roleModel.value) || roleOptions[0]
    ),
  { immediate: true }
)
</script>
