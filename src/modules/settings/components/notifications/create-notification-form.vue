<template>
  <div
    class="create-notification-form"
    v-auto-animate
  >
    <div class="row">
      <div class="col-lg-6">
        <div class="form-group">
          <form-input
            type="text"
            v-model="notificationModel.title"
            label="Заголовок"
            :validators="[($v) => !!$v || 'Заголовок обязателен']"
          />
        </div>
      </div>
      <div class="col-lg-6">
        <notification-type-select
          label="Тип"
          v-model="notificationModel.type"
        />
      </div>
    </div>
    <div class="row">
      <div class="col-lg-6">
        <div class="form-group">
          <text-area
            v-model="notificationModel.message!"
            label="Сообщение (необязательно)"
          />
        </div>
      </div>
      <div class="col-lg-6">
        <div class="form-group">
          <form-input
            label="Ссылка (необязательно)"
            type="url"
            v-model="notificationModel.link!"
          />
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-12">
        <form-checkbox
          label="Создать как баннер"
          v-model="notificationModel.isBanner"
        />
      </div>
    </div>
    <h4>Кому отправить</h4>
    <div class="row">
      <div class="col-lg-6">
        <div class="form-group">
          <select-input
            label="Селектор"
            v-model="sendOptionsModel.selector"
            :options="selectorOptions"
          />
        </div>
      </div>
      <div
        class="col-lg-6"
        v-auto-animate
      >
        <div
          class="form-group"
          v-if="sendOptionsModel.selector === 'role'"
        >
          <user-role-select
            label="Выберите роль"
            v-model="roleSelectorValueModel!"
          />
        </div>
        <div
          class="form-group"
          v-if="sendOptionsModel.selector === 'course'"
        >
          <course-select
            label="Выберите курс"
            v-model="courseSelectorValueModel"
            expectId
          />
        </div>
      </div>
    </div>
    <div
      class="form-errors"
      v-if="errors.length"
    >
      <error-block>
        {{ errors.join(', ') }}
      </error-block>
    </div>
    <div class="form-actions">
      <common-button
        alignment="right"
        @click="createNotification()"
      >
        Создать и отправить
      </common-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Course } from '@/core/data/entities/Course'
import type { Notification } from '@/core/data/entities/Notification'
import type { VisibleRole } from '@/core/services/api/UserService'
import { type NotificationSendOptions } from '@/core/services/store/NotificationService'
import { ref, watch } from 'vue'

interface Emits {
  (
    event: 'create',
    notification: Notification,
    options: NotificationSendOptions
  ): void
}

const emits = defineEmits<Emits>()

const notificationModel = ref<
  Omit<Notification, 'id' | 'userId' | 'status' | 'createdAt'>
>({
  title: '',
  message: '',
  type: 'other',
  link: '',
  isBanner: false
})

const sendOptionsModel = ref<NotificationSendOptions>({
  selector: 'all',
  value: null
})

const roleSelectorValueModel = ref<VisibleRole | null>(null)

watch(
  roleSelectorValueModel,
  () =>
    (sendOptionsModel.value.value = roleSelectorValueModel.value?.value || null)
)

const courseSelectorValueModel = ref<Course | null>(null)

const errors = ref<string[]>([])

watch(
  courseSelectorValueModel,
  () =>
    (sendOptionsModel.value.value = courseSelectorValueModel.value?.id || null)
)

watch(
  () => sendOptionsModel.value.selector,
  () => (sendOptionsModel.value.value = null)
)

function createNotification() {
  errors.value = []

  if (!notificationModel.value.title) {
    errors.value.push('Заголовок обязателен')
    return
  }

  if (
    sendOptionsModel.value.selector === 'role' &&
    !roleSelectorValueModel.value
  ) {
    errors.value.push('Выберите роль')
    return
  }

  if (
    sendOptionsModel.value.selector === 'course' &&
    !courseSelectorValueModel.value
  ) {
    errors.value.push('Выберите курс')
    return
  }

  emits(
    'create',
    notificationModel.value as Notification,
    sendOptionsModel.value
  )
}

const selectorOptions: {
  value: NotificationSendOptions['selector']
  label: string
}[] = [
  { value: 'all', label: 'Всем' },
  { value: 'role', label: 'По роли' },
  { value: 'course', label: 'По курсу' }
]
</script>

<style scoped lang="sass">
.create-notification-form
	.form-actions
		margin-top: 1em
</style>
