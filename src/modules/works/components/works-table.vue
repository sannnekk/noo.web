<template>
  <div class="works-table">
    <entity-table
      :cols="cols"
      :data="works as any"
      :is-loading="loading"
      :actions="actions"
    />
  </div>
</template>

<script setup lang="ts">
import type { ColType } from '@/components/structures/entity-table.vue'
import type { MenuItem } from '@/components/widgets/more-widget.vue'
import type { Work } from '@/core/data/entities/Work'
import { useRouter } from 'vue-router'

interface Props {
  works: Partial<Work>[]
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
    keys: ['name'],
    type: 'text'
  },
  {
    title: 'Тип',
    keys: ['type'],
    type: 'tag',
    tagFunction
  }
  /* {
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
  } */
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

function tagFunction(
  _: string,
  value: string | number | Date
): {
  text: string
  type: 'danger' | 'success' | 'warning' | 'info' | 'primary'
} {
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
</script>
