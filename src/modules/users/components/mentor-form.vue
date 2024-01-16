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
import type { User } from '@/types/entities/User'

interface Props {
  students: Partial<User>[] | undefined
}

const props = defineProps<Props>()

const columns = [
  {
    title: '#',
    type: 'iterator'
  },
  {
    title: 'Имя',
    keys: ['name'],
    type: 'text'
  },
  {
    title: 'Никнейм',
    keys: ['username'],
    type: 'text'
  },
  {
    title: 'Email',
    keys: ['email'],
    type: 'text'
  }
]
</script>

<style scoped lang="sass"></style>
