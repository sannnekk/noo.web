<template>
  <div class="index-create-course-view">
    <the-sidebar-layout>
      <template #sidebar>
        <div class="index-create-course-view__sidebar">
          <div class="index-create-course-view__sidebar__back-button">
            <back-button to="/courses">Назад к курсам</back-button>
          </div>
          <div
            class="index-create-course-view__sidebar__general-view-link"
            v-if="createCourseStore.course"
          >
            <router-link
              :to="`/create-course${
                createCourseStore.course.slug || ''
              }/general`"
            >
              Общая информация
            </router-link>
          </div>
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
import { onUnmounted } from 'vue'

const createCourseStore = useCreateCourseStore()

createCourseStore.fetchCourse()

setPageTitle('Создание/редактирование курса')

const unregister = registerHotkeys(HOT_KEYS)
onUnmounted(() => unregister())
</script>

<style lang="sass" scoped>
.index-create-course-view
  &__sidebar
    &__general-view-link
      margin-bottom: 1em
      font-size: 0.8em

      a
        color: var(--form-text-color)
        text-decoration: none

        &:hover
          color: var(--secondary)

    &__title
      margin: 0

    &__chapters
      margin: 1em 0 2em 0
      max-height: 90vh
      overflow-y: auto

    &__buttons
      margin-top: 1em
      margin-bottom: 1em

      &__publish
        margin-bottom: 1em

      &__delete
        margin-top: 3em
        font-size: 0.7em
</style>
