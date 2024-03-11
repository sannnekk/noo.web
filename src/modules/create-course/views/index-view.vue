<template>
  <div class="index-create-course-view">
    <the-sidebar-layout>
      <template #sidebar>
        <div class="index-create-course-view__sidebar">
          <h3 class="index-create-course-view__sidebar__title">Главы</h3>
          <ol class="index-create-course-view__sidebar__chapters">
            <draggable-list
              v-model="createCourseStore.course!.chapters"
              item-key="name"
            >
              <template v-slot="chapter">
                <li class="index-create-course-view__sidebar__chapters__item">
                  <div
                    class="index-create-course-view__sidebar__chapters__item__item-title"
                  >
                    <span>{{ chapter.item.name }}</span>
                    <span class="icon">
                      <inline-icon
                        name="delete"
                        @click="
                          createCourseStore.removeChapter(chapter.item.slug)
                        "
                      />
                    </span>
                  </div>
                  <ul
                    class="index-create-course-view__sidebar__chapters__item__materials"
                  >
                    <draggable-list
                      v-model="chapter.item.materials"
                      item-key="name"
                    >
                      <template v-slot="{ item }">
                        <li
                          class="index-create-course-view__sidebar__chapters__item__materials__item"
                        >
                          <div
                            class="index-create-course-view__sidebar__chapters__item__item-title"
                          >
                            <router-link
                              :to="`/create-course${$route.params.courseSlug}/${chapter.item.slug}--${item.slug}`"
                            >
                              {{ item.name }}
                            </router-link>
                            <span class="icon">
                              <inline-icon
                                name="delete"
                                @click="
                                  createCourseStore.removeMaterial(item.slug)
                                "
                              />
                            </span>
                          </div>
                        </li>
                      </template>
                    </draggable-list>
                    <li>
                      <span
                        @click="createCourseStore.addMaterial(chapter.item)"
                      >
                        <span
                          class="index-create-course-view__sidebar__chapters__item__materials__add"
                        >
                          Добавить материал
                        </span>
                      </span>
                    </li>
                  </ul>
                </li>
              </template>
            </draggable-list>
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
          <div class="index-create-course-view__sidebar__publish">
            <common-button
              design="primary"
              alignment="stretch"
              @click="createCourseStore.publishCourse()"
            >
              {{ $route.params.courseSlug ? 'Обновить' : 'Опубликовать' }}
            </common-button>
            <br />
            <hr />
            <br />
            <common-button
              v-if="$route.params.courseSlug"
              design="danger"
              alignment="stretch"
              @click="createCourseStore.removeCourse()"
            >
              Удалить курс
            </common-button>
          </div>
        </div>
      </template>
      <template #content>
        <div class="index-create-course-view__course-form">
          <div class="form-group">
            <form-input
              v-model="createCourseStore.course.name"
              label="Название курса"
              type="text"
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

const createCourseStore = useCreateCourseStore()

createCourseStore.fetchCourse()

setPageTitle('Создание/редактирование курса')
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
        color: var(--dark)
        text-decoration: none

      &__item
        margin-bottom: 0.5em

        &__item-title
          display: flex
          justify-content: space-between
          align-items: center

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
              font-weight: bold

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

    &__publish
      margin-top: 1em
      margin-bottom: 1em

  &__course-form
    padding-bottom: 1em
    border-bottom: 1px solid var(--border-color)

    .form-group__label
      color: var(--text-light)
      font-size: 0.8em
</style>
