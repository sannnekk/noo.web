<template>
  <div class="works-table">
    <entity-table
      :cols="cols"
      :data="works"
    />
  </div>
</template>

<script setup lang="ts">
import type { Work } from '@/types/entities/Work'

interface Props {
  works: Partial<Work>[]
}

defineProps<Props>()

const cols = [
  {
    title: '#',
    type: 'iterator'
  },
  {
    title: 'Название работы',
    keys: ['name'],
    type: 'text',
    style: 'bold'
  },
  {
    title: 'Присовенный материал',
    keys: ['material.name'],
    type: 'text',
    style: 'bold'
  },
  {
    title: '',
    value: 'Посмотреть / Редактировать',
    type: 'link',
    linkTo: (work: Work) => `/create-work${work.slug}`
  }
]
</script>
