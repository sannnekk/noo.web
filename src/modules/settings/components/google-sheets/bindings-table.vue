<template>
  <entity-table
    :data="results"
    :cols="cols"
    :actions="actions"
    :is-loading="isLoading"
    class="bindings-table"
  />
  <!-- Modals -->
  <last-binding-error-modal
    :binding-name="lastBindingErrorModalData.bindingName"
    :error="lastBindingErrorModalData.error"
    v-model:visible="lastBindingErrorModalData.isOpen"
  />
</template>

<script setup lang="ts">
import LastBindingErrorModal from './last-binding-error-modal.vue'
import type { ColType } from '@/components/structures/entity-table/entity-table.vue'
import type { MenuItem } from '@/components/widgets/more-widget.vue'
import type { GoogleSheetsBinding } from '@/core/data/entities/GoogleSheetsBinding'
import type { SupportedEntity } from '../../google-docs-bindings/types/SupportedEntity'
import { reactive } from 'vue'

interface Props {
  isLoading?: boolean
  results: GoogleSheetsBinding[]
}

interface Emits {
  (event: 'delete', id: string): void
  (event: 'trigger', id: string): void
  (event: 'switch-on-off', id: string): void
}

defineProps<Props>()
const emits = defineEmits<Emits>()

const cols: ColType[] = [
  {
    title: '',
    type: 'icon',
    value: (item: GoogleSheetsBinding) => getEntityIcon(item.entityName)
  },
  {
    title: 'Название',
    type: 'text',
    value: (item: GoogleSheetsBinding) => item.name
  },
  {
    title: 'Тип',
    type: 'text',
    value: (item: GoogleSheetsBinding) => item.entityName
  },
  {
    title: 'Последний запуск',
    type: 'date',
    value: (item: GoogleSheetsBinding) => item.lastRunAt
  },
  {
    title: 'Статус',
    type: 'text',
    value: (item: GoogleSheetsBinding) => {
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
    value: (item: GoogleSheetsBinding) => item.googleCredentials?.email || ''
  },
  {
    title: 'Дата создания',
    type: 'date',
    value: (item: GoogleSheetsBinding) => item.createdAt
  }
]

function actions(item: GoogleSheetsBinding): MenuItem[] {
  return [
    {
      title: 'Запустить сейчас',
      icon: 'attention-yellow',
      action: () => {
        emits('trigger', item.id)
      }
    },
    {
      title: 'Выключить',
      icon: 'cross-red',
      if: item.status === 'active',
      action: () => {
        emits('switch-on-off', item.id)
      }
    },
    {
      title: 'Включить',
      icon: 'check-green',
      if: item.status === 'inactive',
      action: () => {
        emits('switch-on-off', item.id)
      }
    },
    {
      title: 'Просмотреть ошибку',
      icon: 'cross-red',
      if: item.status === 'error',
      action: () => {
        showLastBindingError(item)
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

const lastBindingErrorModalData = reactive({
  isOpen: false,
  bindingName: '',
  error: ''
})

function showLastBindingError(binding: GoogleSheetsBinding) {
  if (!binding.lastErrorText) return

  lastBindingErrorModalData.bindingName = binding.name
  lastBindingErrorModalData.error = binding.lastErrorText
  lastBindingErrorModalData.isOpen = true
}
</script>

<style lang="sass" scoped>
.bindings-table
  font-size: 0.8em
</style>
