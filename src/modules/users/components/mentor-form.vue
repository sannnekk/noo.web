<template>
  <div class="mentor-form">
    <h3>Ученики куратора</h3>
    <entity-table
      :cols="columns"
      :data="students || []"
    />
  </div>
</template>

<script setup lang="ts">
import type { ColType } from '@/components/structures/entity-table/entity-table.vue'
import type { User } from '@/core/data/entities/User'

interface Props {
  students: User[] | undefined
}

defineProps<Props>()

const columns: ColType[] = [
  {
    title: '#',
    type: 'iterator'
  },
  {
    title: 'Имя',
    type: 'text',
    value: (student: User) => student.name,
    linkTo: (student: User) => `/users/edit/${student.username}`
  },
  {
    title: 'Никнейм',
    type: 'text',
    value: (student: User) => student.username
  },
  {
    title: 'Email',
    type: 'text',
    value: (student: User) => student.email
  }
]
</script>
