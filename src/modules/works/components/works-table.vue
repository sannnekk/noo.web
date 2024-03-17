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

interface Emits {
  (e: 'copy-work', workSlug: Work['slug']): void
  (e: 'delete-work', workSlug: Work['id']): void
}

defineProps<Props>()
const emits = defineEmits<Emits>()

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
    title: 'Тип',
    keys: ['type'],
    type: 'tag',
    tagFunction
  },
  {
    title: '',
    value: 'Копировать',
    type: 'link',
    design: 'secondary',
    action: (work: Work) => emits('copy-work', work.slug)
  },
  {
    title: '',
    value: 'Посмотреть / Редактировать',
    type: 'link',
    linkTo: (work: Work) => `/create-work${work.slug}`
  },
  {
    title: '',
    value: 'Удалить',
    type: 'link',
    design: 'danger',
    action: (work: Work) => emits('delete-work', work.id)
  }
]

function tagFunction(_: string, value: string) {
  switch (value) {
    case 'trial-work':
      return {
        text: 'Пробник',
        type: 'danger'
      }
    case 'phrase':
      return {
        text: 'Фраза',
        type: 'success'
      }
    case 'mini-test':
      return {
        text: 'Мини-тест',
        type: 'primary'
      }
    case 'test':
      return {
        text: 'Тест',
        type: 'warning'
      }
    case 'second-part':
      return {
        text: 'Вторая часть',
        type: 'info'
      }
    default:
      return {
        text: '-',
        type: 'info'
      }
  }
}

function onSelect(work: Work) {
  console.log('Selected work:', work)
}
</script>
