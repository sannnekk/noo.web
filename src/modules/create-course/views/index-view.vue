<template>
  <div class="index-create-course-view">
    <the-sidebar-layout>
      <template #sidebar>
        <div class="index-create-course-view__sidebar">
          <h3 class="index-create-course-view__sidebar__title">Главы</h3>
          <ol class="index-create-course-view__sidebar__chapters">
            <li
              class="index-create-course-view__sidebar__chapters__item"
              v-for="chapter in createCourseStore.course.chapters"
              :key="chapter.id"
            >
              <div
                class="index-create-course-view__sidebar__chapters__item__item-title"
              >
                <span @dblclick="onChapterNameChange(chapter.slug)">
                  {{ chapter.name }}
                </span>
                <span class="icon">
                  <inline-icon
                    name="delete"
                    @click="createCourseStore.removeChapter(chapter.slug)"
                  />
                </span>
              </div>
              <ul
                class="index-create-course-view__sidebar__chapters__item__materials"
              >
                <li
                  class="index-create-course-view__sidebar__chapters__item__materials__item"
                  v-for="item in chapter.materials"
                  :key="item.id"
                >
                  <div
                    class="index-create-course-view__sidebar__chapters__item__item-title"
                  >
                    <router-link
                      :to="`/create-course${$route.params.courseSlug}/${chapter.slug}--${item.slug}`"
                    >
                      {{ item.name }}
                    </router-link>
                    <span class="icon">
                      <inline-icon
                        name="delete"
                        @click="createCourseStore.removeMaterial(item.slug)"
                      />
                    </span>
                  </div>
                </li>
                <li>
                  <span @click="createCourseStore.addMaterial(chapter)">
                    <span
                      class="index-create-course-view__sidebar__chapters__item__materials__add"
                    >
                      Добавить материал
                    </span>
                  </span>
                </li>
              </ul>
            </li>
          </ol>
          <div class="index-create-course-view__sidebar__add-chapter">
            <div class="index-create-course-view__sidebar__add-chapter__input">
              <form-input
                v-model="createCourseStore.newChapterName"
                label="Название главы"
                type="text"
              />
            </div>
            <div class="index-create-course-view__sidebar__add-chapter__button">
              <common-button
                design="secondary"
                alignment="stretch"
                @click="createCourseStore.addChapter"
              >
                Добавить главу
              </common-button>
            </div>
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
        <div class="index-create-course-view__course-form">
          <h3 class="index-create-course-view__course-form__title">
            Общая информация
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
import { setPageTitle } from '@/core/utils/setPageTitle'
import { useCreateCourseStore } from '../stores/create-course'
import { registerHotkeys } from '@/core/device/Hotkeys'
import { HOT_KEYS } from '../utils/hotkeys'
import { computed, onUnmounted } from 'vue'
import type { User } from '@/core/data/entities/User'

const createCourseStore = useCreateCourseStore()

createCourseStore.fetchCourse()

setPageTitle('Создание/редактирование курса')

const onChapterNameChange = (slug: string) => {
  const newName = prompt('Введите новое название главы')
  if (newName) {
    createCourseStore.changeChapterName(slug, newName)
  }
}

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
      padding-bottom: 1em
      border-bottom: 1px solid var(--border-color)

    &__chapters
      padding-left: 1.3em

      a
        color: var(--form-text-color)
        text-decoration: none

      &__item
        margin-bottom: 0.5em

        &__item-title
          display: flex
          justify-content: space-between
          align-items: center
          margin: 0.5em 0
          font-size: 1.1em

          .icon
            cursor: pointer
            display: block
            transition: transform 0.1s ease-in-out

            &:hover
              transform: scale(1.1)

        &__materials
          padding-left: 1.3em
          list-style: square
          font-size: 0.8em

          &__item
            margin-bottom: 0.5em

          a
            &.router-link-active
              color: var(--secondary)

            &:hover
              text-decoration: underline

          &__add
            color: var(--text-light)
            cursor: pointer

            &:hover
              text-decoration: underline

    &__add-chapter
      border-top: 1px solid var(--border-color)
      border-bottom: 1px solid var(--border-color)
      padding: 1em 0
      margin-top: 1em

      &__input
        margin-bottom: 1em

      &__button
        font-size: 0.8em

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
