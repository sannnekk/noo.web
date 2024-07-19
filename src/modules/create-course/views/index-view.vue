<template>
  <div class="index-create-course-view">
    <the-sidebar-layout>
      <template #sidebar>
        <div class="index-create-course-view__sidebar">
          <h3 class="index-create-course-view__sidebar__title">Главы</h3>
          <div
            class="index-create-course-view__sidebar__chapters"
            v-if="createCourseStore.course.chapters"
          >
            <chapter-tree
              v-model:chapters="createCourseStore.course.chapters"
              :course-slug="$route.params.courseSlug as string"
            />
          </div>
          <div class="index-create-course-view__sidebar__buttons">
            <div class="index-create-course-view__sidebar__buttons__publish">
              <common-button
                design="primary"
                alignment="stretch"
                @click="createCourseStore.publishCourse()"
              >
                {{ $route.params.courseSlug ? 'Обновить' : 'Опубликовать' }}
              </common-button>
            </div>
            <div class="index-create-course-view__sidebar__buttons__delete">
              <common-button
                v-if="$route.params.courseSlug"
                design="danger"
                alignment="center"
                @click="createCourseStore.removeCourse()"
              >
                Удалить курс
              </common-button>
            </div>
          </div>
        </div>
      </template>
      <template #content>
        <div class="index-create-course-view__content">
          <router-view :key="$route.fullPath" />
        </div>
        <div class="index-create-course-view__course-form">
          <h3 class="index-create-course-view__course-form__title">
            Общая информация о курсе
          </h3>
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
            <label class="form-group__label">Описание курса</label>
            <text-area v-model="createCourseStore.course.description" />
          </div>
        </div>
      </template>
    </the-sidebar-layout>
  </div>
  <sure-modal
    v-model:visible="createCourseStore.removeCourseModalVisible"
    @confirm="createCourseStore.removeCourse()"
  >
    <template #title>
      <h3>Вы уверены, что хотите удалить курс?</h3>
    </template>
    <template #text>
      <p>Все данные курса будут удалены безвозвратно</p>
    </template>
  </sure-modal>
</template>

<script setup lang="ts">
import chapterTree from '../components/chapter-tree.vue'
import { setPageTitle } from '@/core/utils/setPageTitle'
import { useCreateCourseStore } from '../stores/create-course'
import { registerHotkeys } from '@/core/device/Hotkeys'
import { HOT_KEYS } from '../utils/hotkeys'
import { computed, onUnmounted } from 'vue'
import type { User } from '@/core/data/entities/User'

const createCourseStore = useCreateCourseStore()

createCourseStore.fetchCourse()

setPageTitle('Создание/редактирование курса')

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

const unregister = registerHotkeys(HOT_KEYS)
onUnmounted(() => unregister())
</script>

<style lang="sass" scoped>
.index-create-course-view
  &__sidebar
    &__title
      margin: 0

    &__chapters
      margin: 1em 0 2em 0

    &__buttons
      margin-top: 1em
      margin-bottom: 1em

      &__publish
        margin-bottom: 1em

      &__delete
        margin-top: 3em
        font-size: 0.7em

  &__course-form
    padding: 1em
    margin-bottom: 2em
    border-radius: var(--border-radius)
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1)

    .form-group__label
      color: var(--text-light)
      font-size: 0.8em
</style>
