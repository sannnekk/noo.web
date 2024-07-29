<template>
  <div class="create-binding-view">
    <div class="create-binding-view__form">
      <div class="row">
        <div class="col-md-6">
          <div class="create-binding-view__form-field">
            <form-input
              v-model="bindingStore.createBindingForm.name"
              label="Название интеграции"
              type="text"
            />
          </div>
        </div>
        <div class="col-md-3">
          <div class="create-binding-view__form-field">
            <select-input
              v-model="bindingStore.createBindingForm.frequency"
              label="Частота обновления"
              :options="frequencyOptions"
            />
          </div>
        </div>
        <div class="col-md-3">
          <div class="create-binding-view__form-field">
            <select-input
              v-model="bindingStore.createBindingForm.format"
              label="Формат"
              :options="formatOptions"
            />
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-md-12">
          <div class="create-binding-view__form-field">
            <entity-selection-view
              v-model:entity-name="bindingStore.createBindingForm.entityName"
              v-model:entity-selector="
                bindingStore.createBindingForm.entitySelector
              "
            />
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-md-6">
          <h3>Google-Аккаунт</h3>
          <div class="create-binding-view__form-field">
            <google-auth-button @login="bindingStore.onGoogleLogin($event)" />
          </div>
        </div>
        <div class="col-md-6">
          <h3>Статус</h3>
          <form-checkbox
            v-model="statusModel"
            label="Активировать интеграцию"
          />
        </div>
      </div>
      <div class="create-binding-view__buttons">
        <common-button
          alignment="right"
          @click="bindingStore.saveBinding()"
        >
          Создать интеграцию
        </common-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import EntitySelectionView from '../components/entity-selection-view.vue'
import type { GoogleDocsBinding } from '@/core/data/entities/GoogleDocsBinding'
import { useGoogleDocsBindingsStore } from '../stores/google-docs-bindings'
import { computed } from 'vue'

const bindingStore = useGoogleDocsBindingsStore()

const frequencyOptions: {
  value: GoogleDocsBinding['frequency']
  label: string
}[] = [
  { value: 'hourly', label: 'Ежечасно' },
  { value: 'daily', label: 'Ежедневно' },
  { value: 'weekly', label: 'Еженедельно' },
  { value: 'monthly', label: 'Ежемесячно' }
]

const formatOptions: {
  value: GoogleDocsBinding['format']
  label: string
}[] = [{ value: 'csv', label: 'CSV (формат файлов Excel)' }]

const statusModel = computed({
  get: () => bindingStore.createBindingForm.status === 'active',
  set: (value) =>
    (bindingStore.createBindingForm.status = value ? 'active' : 'inactive')
})
</script>

<style scoped lang="sass">
.create-binding-view
  &__form
    padding: 1em

  &__buttons
    margin-top: 1em
</style>
