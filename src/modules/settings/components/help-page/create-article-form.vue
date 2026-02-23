<template>
  <div class="create-article-form">
    <div class="row">
      <div class="col-lg-6">
        <div class="create-article-form__form-field">
          <form-input
            label="Заголовок"
            v-model="model.title"
            type="text"
          />
        </div>
      </div>
      <div class="col-lg-6">
        <div class="create-article-form__form-field">
          <category-select v-model:category="model.category" />
        </div>
      </div>
    </div>
    <div class="create-article-form__form-field">
      <rich-text-area
        label="Содержание статьи"
        v-model="model.content"
      />
    </div>
    <div class="create-article-form__form-field">
      <p>Для кого видна статья?</p>
      <check-list
        item-key="value"
        item-label-key="label"
        v-model="model.for"
        :items="visibilityOptions"
        multiple
      />
    </div>
    <div class="create-article-form__form-actions">
      <common-button
        alignment="right"
        @click="onCreateArticle()"
      >
        Создать
      </common-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import categorySelect from './category-select.vue'
import { Core } from '@/core/Core'
import type { FAQArticle } from '@/core/data/entities/FAQArticle'
import { emptyDelta, isDeltaEmptyOrWhitespace } from '@/core/utils/deltaHelpers'
import { ref, watch } from 'vue'

interface Emits {
  (event: 'create-article', article: FAQArticle): void
}

const emits = defineEmits<Emits>()

const uiService = Core.Services.UI

const model = ref<FAQArticle>(emptyArticle())

watch(
  model,
  () => {
    const forRole = model.value.for

    if (forRole.at(-1) === 'all' && forRole.length > 1) {
      model.value.for = ['all']
    } else if (forRole.at(0) === 'all' && forRole.length > 1) {
      model.value.for = forRole.filter((v) => v !== 'all')
    }
  },
  { deep: true }
)

function emptyArticle(): FAQArticle {
  return {
    order: 0,
    title: '',
    content: emptyDelta(),
    for: ['all'],
    category: null
  } as any as FAQArticle
}

const visibilityOptions = [
  { value: 'all', label: 'Все' },
  { value: 'student', label: 'Ученик' },
  { value: 'mentor', label: 'Куратор' },
  { value: 'teacher', label: 'Преподаватель' }
]

function onCreateArticle() {
  if (model.value.title.length < 1) {
    uiService.openErrorModal('Заголовок не может быть пустым')
    return
  }

  if (isDeltaEmptyOrWhitespace(model.value.content)) {
    uiService.openErrorModal('Содержание статьи не может быть пустым')
    return
  }

  if (model.value.for.length === 0) {
    uiService.openErrorModal(
      'Необходимо выбрать хотя бы одну группу пользователей'
    )
    return
  }

  if (!model.value.category) {
    uiService.openErrorModal('Необходимо выбрать категорию')
    return
  }

  if (model.value.for.includes('all')) {
    model.value.for = ['all']
  }

  emits('create-article', model.value)
  setTimeout(() => {
    model.value = emptyArticle()
  }, 25)
}
</script>
