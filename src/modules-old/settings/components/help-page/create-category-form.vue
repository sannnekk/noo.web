<template>
  <div class="create-category-form">
    <div class="row">
      <div class="col-lg-6">
        <div class="form-field">
          <form-input
            label="Название категории"
            v-model="model.name"
            type="text"
          />
        </div>
      </div>
      <div class="col-lg-3">
        <div class="form-field">
          <category-select v-model:category="model.parentCategory" />
        </div>
      </div>
      <div class="col-lg-3">
        <div class="form-action">
          <common-button
            alignment="stretch"
            @click="onCreateCategory()"
          >
            Создать
          </common-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import categorySelect from './category-select.vue'
import { Core } from '@/core/Core'
import type { FAQCategory } from '@/core/data/entities/FAQCategory'
import { ref } from 'vue'

interface Emits {
  (event: 'create-category', category: FAQCategory): void
}

const emits = defineEmits<Emits>()

const uiService = Core.Services.UI

const model = ref<FAQCategory>(emptyCategory() as FAQCategory)

function emptyCategory(): Omit<FAQCategory, 'id'> {
  return {
    name: '',
    order: 0,
    parentCategory: null
  } as any
}

function onCreateCategory() {
  if (model.value.name.length === 0) {
    uiService.openErrorModal('Введите название категории')
    return
  }

  if (model.value.name.length > 254) {
    uiService.openErrorModal(
      'Название категории не должно превышать 254 символа'
    )
    return
  }

  model.value.parentCategoryId = model.value.parentCategory?.id || null

  emits('create-category', model.value)
  setTimeout(() => {
    model.value = emptyCategory() as FAQCategory
  }, 25)
}
</script>

<style scoped lang="sass">
.create-category-form
	.form-action
		display: flex
		align-items: flex-end
		height: 100%
		padding-bottom: 0.2em
</style>
