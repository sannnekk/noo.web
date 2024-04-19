<template>
  <status-tag
    :type="userType"
    mode="background"
  >
    {{ userRole }}
  </status-tag>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { type User } from '@/core/data/entities/User'

interface Props {
  role: User['role']
}

const props = defineProps<Props>()

const userRole = computed(() => {
  switch (props.role) {
    case 'admin':
      return 'Администратор'
    case 'teacher':
      return 'Учитель'
    case 'mentor':
      return 'Куратор'
    case 'student':
    default:
      return 'Ученик'
  }
})

const userType = computed(() => {
  switch (props.role) {
    case 'admin':
      return 'danger'
    case 'teacher':
      return 'warning'
    case 'mentor':
      return 'success'
    case 'student':
    default:
      return 'info'
  }
})
</script>
