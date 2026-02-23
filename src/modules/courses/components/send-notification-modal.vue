<template>
  <sure-modal
    v-model:visible="visibilityModel"
    @confirm="onConfirm()"
  >
    <template #title>
      <h3>Отправить уведомление ученикам курса "{{ course.name }}"</h3>
    </template>
    <template #text>
      <div class="send-notification__form">
        <error-block v-if="errors.length">
          {{ errors.join(', ') }}
        </error-block>
        <div class="send-notification__form__group">
          <form-input
            label="Название"
            type="text"
            v-model="notificationModel.title"
            :validators="[($v) => !!$v || 'Название обязательно']"
          />
        </div>
        <div class="send-notification__form__group">
          <notification-type-select
            label="Тип уведомления"
            v-model="notificationModel.type"
          />
        </div>
        <div class="send-notification__form__group">
          <text-area
            v-model="notificationModel.message!"
            label="Сообщение"
          />
        </div>
        <div class="send-notification__form__group">
          <form-input
            v-model="notificationModel.link!"
            label="Ссылка (необязательно)"
            type="url"
          />
        </div>
        <div class="send-notification__form__group">
          <form-checkbox
            label="Отправить как баннер"
            v-model="notificationModel.isBanner"
          />
        </div>
        <div class="send-notification__form__warning">
          <warning-block v-if="(course.studentCount || 0) > 500">
            На этом курсе {{ course.studentCount }} учеников. Возможно, отправка
            уведомления займет некоторое время из-за большого количества
            адресатов.
          </warning-block>
        </div>
      </div>
    </template>
  </sure-modal>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Notification } from '@/core/data/entities/Notification'
import type { Course } from '@/core/data/entities/Course'

interface Props {
  visible: boolean
  course: Course
}

interface Emits {
  (event: 'update:visible', value: boolean): void
  (event: 'send-notification', notification: Notification): void
}

const props = defineProps<Props>()
const emits = defineEmits<Emits>()

const visibilityModel = computed({
  get: () => props.visible,
  set: (value: boolean) => emits('update:visible', value)
})

const notificationModel = ref<
  Omit<Notification, 'id' | 'userId' | 'status' | 'createdAt'>
>({
  title: '',
  message: '',
  type: 'other',
  link: '',
  isBanner: false
})

const errors = ref<string[]>([])

function onConfirm() {
  errors.value = []

  if (notificationModel.value.title.trim() === '') {
    errors.value.push('Название обязательно')
    setTimeout(() => (visibilityModel.value = true), 1)
    return
  }

  if (notificationModel.value.message?.trim() === '') {
    errors.value.push('Сообщение обязательно')
    setTimeout(() => (visibilityModel.value = true), 1)
    return
  }

  emits('send-notification', notificationModel.value as Notification)
}
</script>

<style scoped lang="sass">
.send-notification
	&__form
		&__group
			margin-bottom: 0.3em

		&__warning
			margin-top: 1em
			font-size: 0.8em
</style>
