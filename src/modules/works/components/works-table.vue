<template>
  <div class="works-table">
    <entity-table
      :cols="cols"
      :data="works"
      :is-loading="loading"
    />
  </div>
</template>

<script setup lang="ts">
import type { Work } from '@/core/data/entities/Work'

interface Props {
  works: Partial<Work>[]
  loading?: boolean
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
    title: 'Присвоенный материал',
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
@/core/data/entities/Work
