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
    <div class="row">
      <div class="col-md-6">
        <div class="form-group">
          <users-select
            label="Автор(ы) курса (до 10)"
            v-model="createCourseStore.course.authors"
            role="teacher"
            :max-count="10"
          />
        </div>
      </div>
      <div class="col-md-6">
        <div class="form-group">
          <subject-select
            label="Предмет"
            v-model="createCourseStore.course.subject"
          />
        </div>
      </div>
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
import { useCreateCourseStore } from '../stores/create-course'

const createCourseStore = useCreateCourseStore()
</script>
