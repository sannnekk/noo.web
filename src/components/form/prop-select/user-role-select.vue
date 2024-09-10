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
  modelValue: VisibleRole
}

interface Emits {
  (event: 'update:modelValue', value: VisibleRole): void
}

const props = defineProps<Props>()
const emits = defineEmits<Emits>()

const roleModel = ref<string>(props.modelValue.value)

watch(
  () => roleModel.value,
  () =>
    emits(
      'update:modelValue',
      roleOptions.find((o) => o.value === roleModel.value)! as VisibleRole
    )
)

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
