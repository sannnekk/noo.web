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
              Ученики курса ({{ courseStore.course.studentIds?.length || 0 }})
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
            class="index-materials-view__tree__author"
            v-if="courseStore.course.author"
          >
            <inline-user-card :user="courseStore.course.author" />
          </div>
          <materials-tree :data="courseStore.materialsTree" />
        </div>
      </template>
      <template #content>
        <div class="index-materials-view__content">
          <router-view :key="$route.fullPath" />
        </div>
      </template>
    </the-sidebar-layout>
  </div>
</template>

<script lang="ts" setup>
import MaterialsTree from '../components/materials-tree.vue'
import { useCourseStore } from '../stores/course'
import { Core } from '@/core/Core'
import { setPageTitle } from '@/core/utils/setPageTitle'
import { watch } from 'vue'

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
        margin-bottom: 1rem
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
        margin-bottom: 1rem
        font-size: 0.8em
        color: var(--text-light)
        text-decoration: none

        &:hover
          color: var(--secondary)

    &__title
      h2
        margin-bottom: 1em
        font-size: 1.3rem
        font-weight: bold

.students-modal
  &__search
    margin-bottom: 1rem

  &__list
    max-height: 60vh
    overflow-y: auto
</style>
