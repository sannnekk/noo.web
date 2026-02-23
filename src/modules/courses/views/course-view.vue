<template>
  <div
    class="index-materials-view"
    v-if="courseStore.course"
  >
    <the-sidebar-layout>
      <template #sidebar>
        <div class="index-materials-view__tree">
          <div class="index-materials-view__tree__back-button">
            <back-button to="/courses">Ко всем курсам</back-button>
          </div>
          <div class="index-materials-view__tree__students">
            <router-link
              v-if="Core.Context.roleIs(['teacher', 'admin'])"
              :to="`/course-students/${courseStore.course.slug}`"
            >
              <inline-icon
                name="user"
                class="index-materials-view__tree__students__icon"
              />
              Ученики курса ({{ courseStore.course.studentCount || 0 }})
            </router-link>
          </div>
          <div class="index-materials-view__tree__edit-course">
            <router-link
              v-if="Core.Context.roleIs(['teacher', 'admin'])"
              :to="`/create-course${courseStore.course.slug}`"
            >
              <inline-icon
                name="edit"
                class="index-materials-view__tree__edit-course__icon"
              />
              Редактировать курс
            </router-link>
          </div>
          <div class="index-materials-view__tree__send-notification">
            <span
              v-if="Core.Context.roleIs(['teacher', 'admin'])"
              @click="sendNotificationModalOpened = true"
            >
              <inline-icon
                name="notifications"
                class="index-materials-view__tree__send-notification__icon"
              />
              Уведомление ученикам
            </span>
          </div>
          <div
            class="index-materials-view__tree__subject"
            v-if="courseStore.course.subject"
          >
            <subject-name :subject="courseStore.course.subject" />
          </div>
          <div class="index-materials-view__tree__title">
            <h2>{{ courseStore.course.name }}</h2>
          </div>
          <div
            class="index-materials-view__tree__authors"
            v-if="courseStore.course.authors"
          >
            <inline-user-card-list :users="courseStore.course.authors">
              <template #more-button="{ isOpened }">
                {{ isOpened ? 'Скрыть' : 'Показать всех авторов' }}
              </template>
              <template #empty>Авторы не указаны</template>
            </inline-user-card-list>
          </div>
          <div
            class="index-materials-view__tree__toggle-hidden"
            v-if="Core.Context.roleIs(['admin', 'teacher'])"
          >
            <form-toggle
              v-model="showHiddenItems"
              :values="[
                { value: true, label: 'Показывать неопубликованные' },
                { value: false, label: 'Скрыть неопубликованные' }
              ]"
            />
          </div>
          <pinned-materials-list
            :chapters="courseStore.course.chapters"
            :show-hidden="showHiddenItems"
          />
          <materials-tree
            :data="courseStore.materialsTree"
            :show-hidden="showHiddenItems"
          />
          <div
            class="index-materials-view__tree__course-id"
            v-if="Core.Context.roleIs(['admin', 'teacher', 'assistant'])"
          >
            <form-input
              type="text"
              label="Идентификатор курса"
              :model-value="courseStore.course.id"
              readonly
              copy-button
            />
          </div>
        </div>
      </template>
      <template #content>
        <div class="index-materials-view__content">
          <router-view :key="$route.fullPath" />
        </div>
      </template>
    </the-sidebar-layout>
  </div>
  <send-notification-modal
    v-model:visible="sendNotificationModalOpened"
    :course="courseStore.course!"
    @send-notification="courseStore.sendNotification($event)"
  />
</template>

<script lang="ts" setup>
import PinnedMaterialsList from '../components/pinned-materials-list.vue'
import sendNotificationModal from '../components/send-notification-modal.vue'
import MaterialsTree from '../components/materials-tree.vue'
import { useCourseStore } from '../stores/course'
import { Core } from '@/core/Core'
import { setPageTitle } from '@/core/utils/setPageTitle'
import { ref, watch } from 'vue'

const courseStore = useCourseStore()

courseStore.fetchCourse()

if (courseStore.course?.name) {
  setPageTitle(courseStore.course.name)
}

watch(
  () => courseStore.course,
  () => {
    if (courseStore.course?.name) {
      setPageTitle(courseStore.course.name)
    }
  },
  { deep: true, immediate: true }
)

const sendNotificationModalOpened = ref(false)

const showHiddenItems = ref(false)
</script>

<style lang="sass" scoped>
.index-materials-view
  &__tree
    &__students
      &__icon
        font-size: 1.5em
        position: relative
        top: 0.2em

      a
        cursor: pointer
        display: block
        margin-bottom: 0.5rem
        font-size: 0.8em
        color: var(--text-light)
        text-decoration: none

        &:hover
          color: var(--secondary)

    &__edit-course
      &__icon
        font-size: 1.3em
        margin-left: 0.1em
        position: relative
        top: 0.2em

      a
        cursor: pointer
        display: block
        margin-bottom: 0.5rem
        font-size: 0.8em
        color: var(--text-light)
        text-decoration: none

        &:hover
          color: var(--secondary)

    &__send-notification
      &__icon
        font-size: 1.3em
        margin-left: 0.1em
        position: relative
        top: 0.2em

      span
        cursor: pointer
        display: block
        margin-bottom: 1rem
        font-size: 0.8em
        color: var(--text-light)
        text-decoration: none

        &:hover
          color: var(--secondary)

    &__title
      h2
        font-size: 1.3rem
        font-weight: bold
        margin-bottom: 0.5em

    &__authors
      margin: 1em 0

    &__course-id
      margin-top: 1em

    &__toggle-hidden
      margin-bottom: 0.5em
      margin-top: 0.5em
      font-size: 0.8em

.students-modal
  &__search
    margin-bottom: 1rem

  &__list
    max-height: 60vh
    overflow-y: auto
</style>
