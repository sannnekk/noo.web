<template>
  <div class="general-info-view">
    <h3 class="general-info-view__title">Общая информация о курсе</h3>
    <div class="form-group">
      <form-input
        v-model="createCourseStore.course.name"
        label="Название курса"
        type="text"
      />
    </div>
    <div class="form-group">
      <entity-select-input
        label="Автор курса (по умолчанию - Вы)"
        :fetch-function="createCourseStore.fetchTeachers"
        :max-count="1"
        :label-keys="['name', 'username']"
        v-model="authorModel"
      />
    </div>
    <div class="form-group">
      <file-input
        label="Картинка курса"
        :max-count="1"
        :allowed-mime-types="['image/jpeg', 'image/png']"
        v-model="createCourseStore.course.images"
      />
    </div>
    <div class="form-group">
      <text-area
        label="Описание курса"
        v-model="createCourseStore.course.description"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { User } from '@/core/data/entities/User'
import { useCreateCourseStore } from '../stores/create-course'

const createCourseStore = useCreateCourseStore()

const authorModel = computed<User[]>({
  get: () => {
    if (createCourseStore.course.author) {
      return [createCourseStore.course.author]
    }
    return []
  },
  set: (value) => {
    if (value.length === 0) {
      createCourseStore.course.author = undefined
    }
    createCourseStore.course.author = value[0]
  }
})
</script>
