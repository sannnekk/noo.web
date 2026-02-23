<template>
  <entity-table
    :cols="cols"
    :data="articles"
    :actions="actions"
  />
  <sure-delete-modal
    v-model:visible="deleteModal.visible"
    @confirm="onDelete()"
  >
    <template #title> Удаление статьи </template>
    <template #text>
      Вы уверены, что хотите удалить статью "{{ deleteModal.article?.title }}"?
    </template>
  </sure-delete-modal>
</template>

<script setup lang="ts">
import type { ColType } from '@/components/structures/entity-table/entity-table.vue'
import type { FAQArticle } from '@/core/data/entities/FAQArticle'
import type { MenuItem } from '@/components/widgets/more-widget.vue'
import { reactive } from 'vue'

interface Props {
  articles: FAQArticle[]
}

interface Emits {
  (event: 'edit', article: FAQArticle): void
  (event: 'delete', article: FAQArticle): void
}

defineProps<Props>()
const emits = defineEmits<Emits>()

const cols: ColType[] = [
  {
    title: 'Название',
    type: 'text',
    value: (row: FAQArticle) => row.title
  },
  {
    title: 'Категория',
    type: 'text',
    value: (row: FAQArticle) => row.category?.name || '-'
  },
  {
    title: 'Для',
    type: 'text',
    value: (row: FAQArticle) => {
      return (row.for || [])
        .map((f) => {
          switch (f) {
            case 'admin':
              return 'Администраторов'
            case 'teacher':
              return 'Преподавателей'
            case 'student':
              return 'Учеников'
            case 'mentor':
              return 'Кураторов'
            case 'all':
            default:
              return 'Всех'
          }
        })
        .join(', ')
    }
  }
]

function actions(row: FAQArticle): MenuItem[] {
  return [
    {
      title: 'Редактировать',
      icon: 'edit',
      action: () => {
        openEditModal(row)
      }
    },
    {
      title: 'Удалить',
      icon: 'delete',
      action: () => {
        openDeleteModal(row)
      }
    }
  ]
}

const editModal = reactive({
  visible: false,
  article: null as FAQArticle | null
})

const deleteModal = reactive({
  visible: false,
  article: null as FAQArticle | null
})

function openEditModal(article: FAQArticle) {
  editModal.article = article
  editModal.visible = true
}

function openDeleteModal(article: FAQArticle) {
  deleteModal.article = article
  deleteModal.visible = true
}

function onDelete() {
  if (deleteModal.article) {
    emits('delete', deleteModal.article)
  }
  deleteModal.visible = false
}
</script>
