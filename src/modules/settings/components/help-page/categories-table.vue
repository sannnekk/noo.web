<template>
  <div class="categories-table">
    <tree-entity-table
      :data="categories"
      :cols="cols"
      :actions="actions"
      :children="children"
    />
  </div>
  <sure-delete-modal
    v-model:visible="deleteModalData.visible"
    @confirm="onDelete()"
  >
    <template #title>Удаление категории</template>
    <template #text>
      Вы уверены, что хотите удалить категорию "{{
        deleteModalData.item?.name
      }}" ?
    </template>
  </sure-delete-modal>
  <edit-category-modal
    v-if="editModalData.item"
    v-model:visible="editModalData.visible"
    :category="editModalData.item"
    @confirm="onEdit($event)"
  />
</template>

<script setup lang="ts">
import type { TreeColType } from '@/components/structures/entity-table/types'
import EditCategoryModal from './edit-category-modal.vue'
import type { MenuItem } from '@/components/widgets/more-widget.vue'
import type { FAQCategory } from '@/core/data/entities/FAQCategory'
import { reactive } from 'vue'

interface Props {
  categories: FAQCategory[]
}

interface Emist {
  (event: 'edit', value: FAQCategory): void
  (event: 'delete', value: FAQCategory): void
}

defineProps<Props>()
const emits = defineEmits<Emist>()

const cols: TreeColType[] = [
  {
    title: 'Название',
    type: 'text',
    value: (item: FAQCategory) => item.name
  },
  {
    title: 'Дата создания/изменения',
    type: 'date',
    value: (item: FAQCategory) => [item.createdAt, item.updatedAt],
    joinType: '/'
  }
]

function children(item: FAQCategory): any[] {
  return item.childCategories
}

function actions(item: FAQCategory): MenuItem[] {
  return [
    {
      title: 'Редактировать',
      icon: 'edit',
      action: () => openEditModal(item)
    },
    {
      title: 'Удалить',
      icon: 'delete',
      action: () => openDeleteModal(item)
    }
  ]
}

const editModalData = reactive({
  visible: false,
  item: null as FAQCategory | null
})

const deleteModalData = reactive({
  visible: false,
  item: null as FAQCategory | null
})

function openEditModal(item: FAQCategory) {
  editModalData.visible = true
  editModalData.item = item
}

function openDeleteModal(item: FAQCategory) {
  deleteModalData.visible = true
  deleteModalData.item = item
}

function onDelete() {
  if (deleteModalData.item) {
    emits('delete', deleteModalData.item)
  }
}

function onEdit(category: FAQCategory) {
  if (editModalData.item) {
    emits('edit', category)
  }
}
</script>
