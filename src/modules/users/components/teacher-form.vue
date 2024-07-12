<template>
  <div class="teacher-form">
    <h3>Курсы преподавателя</h3>
    <entity-table
      :cols="columns"
      :data="courses || []"
    />
  </div>
</template>

<script setup lang="ts">
import type { Course } from '@/core/data/entities/Course'

interface Props {
  courses: Partial<Course>[] | undefined
}

defineProps<Props>()

const columns = [
  {
    title: '#',
    type: 'iterator'
  },
  {
    title: 'Название',
    keys: ['name'],
    type: 'text'
  },
  {
    title: 'Участники',
    keys: ['students'],
    type: 'text',
    value: (course: Course) => (course.students || []).length
  }
]
</script>

<style scoped lang="sass"></style>
