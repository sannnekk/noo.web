<template>
  <div class="works-table">
    <entity-table
      :cols="cols"
      :data="works"
      :is-loading="loading"
      :actions="actions"
    />
  </div>
</template>

<script setup lang="ts">
import type { ColType } from '@/components/structures/entity-table/entity-table.vue'
import type { MenuItem } from '@/components/widgets/more-widget.vue'
import type { Work } from '@/core/data/entities/Work'
import { useRouter } from 'vue-router'

interface Props {
  works: Work[]
  loading?: boolean
}

interface Emits {
  (e: 'copy-work', workSlug: Work['slug']): void
  (e: 'delete-work', workId: Work['id']): void
}

defineProps<Props>()
const emits = defineEmits<Emits>()

const router = useRouter()

const cols: ColType[] = [
  {
    title: 'Название работы',
    type: 'text',
    value: (work: Work) => work.name
  },
  {
    title: 'Тип',
    type: 'text',
    value: (work: Work) => {
      switch (work.type) {
        case 'trial-work':
          return '<span style="color: var(--danger)">Пробник</span>'
        case 'phrase':
          return '<span style="color: var(--success)">Фраза</span>'
        case 'mini-test':
          return '<span style="color: var(--info)">Мини-тест</span>'
        case 'test':
          return '<span style="color: var(--warning)">Тест</span>'
        case 'second-part':
          return '<span style="color: var(--text-light)">Вторая часть</span>'
        default:
          return '-'
      }
    }
  },
  {
    title: 'Дата создания/изменения',
    type: 'date',
    joinType: '/',
    value: (work: Work) => [work.createdAt, work.updatedAt]
  }
]

function actions(row: Work): MenuItem[] {
  return [
    {
      title: 'Копировать',
      icon: 'copy',
      action: () => {
        emits('copy-work', row.slug)
      }
    },
    {
      title: 'Посмотреть/Редактировать',
      icon: 'edit',
      action: () => {
        router.push(`/create-work${row.slug}`)
      }
    },
    {
      title: 'Удалить',
      icon: 'delete',
      action: () => {
        emits('delete-work', row.id)
      }
    }
  ]
}
</script>
