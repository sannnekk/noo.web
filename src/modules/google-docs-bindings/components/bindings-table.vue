<template>
  <entity-table
    :data="results"
    :cols="cols"
    :actions="actions"
    :is-loading="isLoading"
  />
</template>

<script setup lang="ts">
import type { ColType } from '@/components/structures/entity-table/entity-table.vue'
import type { MenuItem } from '@/components/widgets/more-widget.vue'
import type { GoogleDocsBinding } from '@/core/data/entities/GoogleDocsBinding'
import type { SupportedEntity } from '../types/SupportedEntity'

interface Props {
  isLoading?: boolean
  results: GoogleDocsBinding[]
}

interface Emits {
  (event: 'delete', id: string): void
  (event: 'trigger', id: string): void
  (event: 'show-error', id: string): void
  (event: 'switch-on-off', id: string): void
}

defineProps<Props>()
const emits = defineEmits<Emits>()

const cols: ColType[] = [
  {
    title: '',
    type: 'icon',
    value: (item: GoogleDocsBinding) => getEntityIcon(item.entityName)
  },
  {
    title: 'Название',
    type: 'text',
    value: (item: GoogleDocsBinding) => item.name
  },
  {
    title: 'Тип',
    type: 'text',
    value: (item: GoogleDocsBinding) => item.entityName
  },
  {
    title: 'Последний запуск',
    type: 'date',
    value: (item: GoogleDocsBinding) => item.lastRunAt
  },
  {
    title: 'Статус',
    type: 'text',
    value: (item: GoogleDocsBinding) => {
      switch (item.status) {
        case 'active':
          return '<span style="color: var(--success)">Активна</span>'
        case 'inactive':
          return '<span style="color: var(--text-light)">Неактивна</span>'
        case 'error':
          return '<span style="color: var(--danger)">Ошибка</span>'
        default:
          return `<span style="color: var(--text-light)">${item.status}</span>`
      }
    }
  },
  {
    title: 'Аккаунт Google',
    type: 'text',
    value: (item: GoogleDocsBinding) => item.googleCredentials?.email || ''
  },
  {
    title: 'Дата создания',
    type: 'date',
    value: (item: GoogleDocsBinding) => item.createdAt
  }
]

function actions(item: GoogleDocsBinding): MenuItem[] {
  return [
    {
      title: 'Запустить сейчас',
      icon: 'attention-yellow',
      action: () => {
        emits('trigger', item.id)
      }
    },
    {
      title: 'Включить/выключить',
      icon: 'check-green',
      action: () => {
        emits('switch-on-off', item.id)
      }
    },
    {
      title: 'Просмотреть ошибку',
      icon: 'cross-red',
      action: () => {
        emits('show-error', item.id)
      }
    },
    {
      title: 'Удалить',
      icon: 'delete',
      action: () => {
        emits('delete', item.id)
      }
    }
  ]
}

function getEntityIcon(
  entityName: SupportedEntity['technicalName']
): string | null {
  switch (entityName) {
    case 'poll_answer':
      return 'poll'
    case 'user':
      return 'users'
    default:
      return null
  }
}
</script>

<style scoped lang="ts"></style>
