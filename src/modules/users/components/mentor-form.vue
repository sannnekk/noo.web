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
import type { UserWithSubject } from '@/modules/students/stores/students'

interface Props {
  students: UserWithSubject[]
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
    title: 'Предмет',
    type: 'subject',
    value: (student: UserWithSubject) => student.subject
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

<style lang="sass" scoped>
.mentor-form
	max-width: 100%
	overflow-x: auto
</style>
