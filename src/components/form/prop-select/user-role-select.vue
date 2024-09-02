<template>
  <select-input
    :label="label"
    :options="roleOptions"
    v-model="roleModel"
  />
</template>

<script setup lang="ts">
import type { VisibleRole } from '@/core/services/api/UserService'
import { computed } from 'vue'

interface Props {
  label: string
  modelValue: VisibleRole
}

interface Emits {
  (event: 'update:modelValue', value: VisibleRole): void
}

const props = defineProps<Props>()
const emits = defineEmits<Emits>()

const roleModel = computed<VisibleRole>({
  get: () => props.modelValue,
  set: (value) => emits('update:modelValue', value)
})

const roleOptions = [
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
  }
]
</script>
