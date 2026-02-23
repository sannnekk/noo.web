<template>
  <div class="create-binding-view">
    <div class="create-binding-view__form">
      <div class="row">
        <div class="col-md-6">
          <div class="create-binding-view__form-field">
            <form-input
              v-model="createBindingForm.name"
              label="Название интеграции"
              type="text"
            />
          </div>
        </div>
        <div class="col-md-6">
          <div class="create-binding-view__form-field">
            <select-input
              v-model="createBindingForm.frequency"
              label="Частота обновления"
              :options="frequencyOptions"
            />
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-md-12">
          <div class="create-binding-view__form-field">
            <entity-selection-view
              v-model:entity-name="createBindingForm.entityName"
              v-model:entity-selector="createBindingForm.entitySelector"
            />
          </div>
        </div>
      </div>
      <div class="row">
        <div
          class="col-md-6"
          v-auto-animate
        >
          <h4>Google-Аккаунт</h4>
          <success-block v-if="createBindingForm.googleOAuthToken">
            Вы успешно авторизовались в Google
          </success-block>
          <div
            class="create-binding-view__google-auth-button"
            v-else
          >
            <google-auth-button @login="onGoogleLogin($event)" />
          </div>
        </div>
        <div class="col-md-6">
          <h4>Статус</h4>
          <form-checkbox
            v-model="statusModel"
            label="Активировать интеграцию"
          />
        </div>
      </div>
      <div class="create-binding-view__buttons">
        <common-button
          alignment="right"
          @click="onSaveBinding()"
        >
          Создать интеграцию
        </common-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Core } from '@/core/Core'
import entitySelectionView from './entity-selection-view.vue'
import type { GoogleSheetsBinding } from '@/core/data/entities/GoogleSheetsBinding'
import { computed, ref } from 'vue'

interface Emits {
  (event: 'create-integration', binding: GoogleSheetsBinding): void
}

const emits = defineEmits<Emits>()

const uiService = Core.Services.UI

const createBindingForm = ref<
  Omit<GoogleSheetsBinding, 'id' | 'createdAt' | 'updatedAt'>
>(emptyBindingForm())

function emptyBindingForm(): Omit<
  GoogleSheetsBinding,
  'id' | 'createdAt' | 'updatedAt'
> {
  return {
    name: '',
    entityName: '',
    entitySelector: {
      prop: '',
      value: ''
    },
    status: 'active',
    lastErrorText: null,
    frequency: 'daily',
    filePath: [],
    googleOAuthToken: '',
    googleCredentials: null as any,
    lastRunAt: null
  }
}

function onGoogleLogin(rawCredentials: any) {
  createBindingForm.value.googleOAuthToken = rawCredentials.code
  createBindingForm.value.googleCredentials = rawCredentials
}

function onSaveBinding() {
  try {
    validateBindingForm(createBindingForm.value)
  } catch (error: any) {
    uiService.openErrorModal('Не удлоась создать интеграцию', error.message)
  }
  emits('create-integration', createBindingForm.value as GoogleSheetsBinding)
  createBindingForm.value = emptyBindingForm()
}

function validateBindingForm(form: Partial<GoogleSheetsBinding>) {
  if (!form) {
    throw new Error('Форма не заполнена')
  }

  if (!form.name) {
    throw new Error('Название не заполнено')
  }

  if (!form.entityName) {
    throw new Error('Выберите модуль для привязки')
  }

  if (
    !form.entitySelector ||
    !form.entitySelector?.prop ||
    !form.entitySelector?.value
  ) {
    throw new Error('Свойство селектора сущности не заполнено')
  }

  if (!form.googleOAuthToken || !form.googleCredentials) {
    throw new Error('Перед отправкой необходимо авторизоваться через Google')
  }
}

const frequencyOptions: {
  value: GoogleSheetsBinding['frequency']
  label: string
}[] = [
  { value: 'hourly', label: 'Ежечасно' },
  { value: 'daily', label: 'Ежедневно' },
  { value: 'weekly', label: 'Еженедельно' },
  { value: 'monthly', label: 'Ежемесячно' }
]

const statusModel = computed({
  get: () => createBindingForm.value.status === 'active',
  set: (value) =>
    (createBindingForm.value.status = value ? 'active' : 'inactive')
})
</script>

<style scoped lang="sass">
.create-binding-view
  &__google-auth-button
    font-size: 0.8em

  &__buttons
    margin-top: 1em
</style>
