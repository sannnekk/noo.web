<template>
  <div
    class="index-materials-view"
    v-if="courseStore.course"
  >
    <the-sidebar-layout>
      <template #sidebar>
        <div class="index-materials-view__tree">
          <router-link
            class="index-materials-view__tree__back-button"
            to="/courses"
          >
            &#8249; Ко всем курсам
          </router-link>
          <span
            class="index-materials-view__tree__students"
            v-if="Core.Context.User?.role === 'teacher'"
            @click="assignStudentsStore.modalVisible = true"
          >
            Ученики курса ({{ assignStudentsStore.studentsCount }})
          </span>
          <h2 class="index-materials-view__tree__title">
            {{ courseStore.course.name }}
          </h2>
          <!-- <div class="index-materials-view__tree__author">
            <div class="index-materials-view__tree__author__avatar">
              <user-avatar :name="materialsStore.course.author.name" />
            </div>
            <div class="index-materials-view__tree__author__name">
              <span>{{ materialsStore.course.author.name }}</span>
            </div>
          </div> -->
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
  <assign-student-modal />
</template>

<script lang="ts" setup>
import MaterialsTree from '../components/materials-tree.vue'
import AssignStudentModal from '../components/assign-student-modal.vue'
import { useCourseStore } from '../stores/course'
import { useAssignStudentsStore } from '../stores/assign-student'
import { Core } from '@/core/Core'

const courseStore = useCourseStore()
const assignStudentsStore = useAssignStudentsStore()

courseStore.fetchCourse()
</script>

<style lang="sass" scoped>
.index-materials-view
  &__tree
    &__back-button
      display: block
      margin-bottom: 1rem
      font-size: 0.8em
      color: var(--text-light)
      text-decoration: none

      &:hover
        color: var(--secondary)

    &__students
      cursor: pointer
      display: block
      margin-bottom: 1rem
      font-size: 0.8em
      color: var(--text-light)
      text-decoration: none

      &:hover
        color: var(--secondary)

    &__title
      margin-bottom: 0
      font-size: 1.3rem
      font-weight: bold

    &__author
      display: flex
      align-items: center
      margin-bottom: 1em

      &__avatar
        margin-right: 0.5rem

      &__name
        font-size: 0.9em
        font-weight: 500

        span
          text-decoration: none
          color: var(--text-light)


.students-modal
  &__search
    margin-bottom: 1rem

  &__list
    max-height: 60vh
    overflow-y: auto
</style>
../stores/courses
