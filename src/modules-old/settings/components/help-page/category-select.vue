<template>
  <entity-select-input
    v-model="model"
    :fetch-function="searchCategories"
    label="Выберите категорию"
    :label-keys="['name']"
    :max-count="1"
  />
</template>

<script setup lang="ts">
import { Core } from '@/core/Core'
import type { Pagination } from '@/core/data/Pagination'
import type { FAQCategory } from '@/core/data/entities/FAQCategory'
import { computed } from 'vue'

interface Props {
  category: FAQCategory | null
}

interface Emits {
  (event: 'update:category', value: FAQCategory | null): void
}

const props = defineProps<Props>()
const emits = defineEmits<Emits>()

const model = computed({
  get: () => (props.category ? [props.category] : []),
  set: (value) => emits('update:category', value.at(0) || null)
})

const faqService = Core.Services.FAQ
const uiService = Core.Services.UI

async function searchCategories(pagination: Pagination) {
  try {
    return faqService.searchCategories(pagination)
  } catch (error: any) {
    uiService.openErrorModal('Не удалось загрузить категории', error.message)
  }
}
</script>
