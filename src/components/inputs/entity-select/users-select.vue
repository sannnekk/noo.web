<template>
  <entity-select-input
    :label="label"
    :fetch-function="fetchUsers"
    :label-keys="['name', 'username']"
    :max-count="maxCount"
    v-model="userModel"
  />
</template>

<script setup lang="ts">
import { Core } from '@/core/Core'
import type { Pagination } from '@/core/data/Pagination'
import type { User } from '@/core/data/entities/User'
import { computed } from 'vue'

interface Props {
  label: string
  modelValue: User[]
  role?: User['role']
  maxCount?: number
}

interface Emits {
  (event: 'update:modelValue', value: User[]): void
}

const props = defineProps<Props>()
const emits = defineEmits<Emits>()

const userService = Core.Services.User
const uiService = Core.Services.UI

async function fetchUsers(pagination?: Pagination) {
  try {
    switch (props.role) {
      case 'teacher':
        return userService.getTeachers(pagination)
      case 'mentor':
        return userService.getMentors(pagination)
      case 'student':
        return userService.getStudents(pagination)
      default:
        return userService.getUsers(pagination)
    }
  } catch (error: any) {
    uiService.openErrorModal(
      'Произошла ошибка при загрузке пользователей',
      error.message
    )
  }
}

const userModel = computed<User[]>({
  get: () => props.modelValue,
  set: (value) => emits('update:modelValue', value)
})
</script>
