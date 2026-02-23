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
import type { ColType } from '@/components/structures/entity-table/entity-table.vue'
import type { Course } from '@/core/data/entities/Course'

interface Props {
  courses: Course[] | undefined
}

defineProps<Props>()

const columns: ColType[] = [
  {
    title: '',
    type: 'image',
    value: (course: Course) => course.images.at(0)
  },
  {
    title: 'Название',
    type: 'text',
    value: (course: Course) => course.name,
    linkTo: (course: Course) => `/courses/${course.slug}`
  },
  {
    title: 'Предмет',
    type: 'subject',
    value: (course: Course) => course.subject
  },
  {
    title: 'Участники',
    type: 'text',
    value: (course: Course) => (course.students || []).length
  }
]
</script>
