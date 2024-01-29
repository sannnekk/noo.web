<template>
  <div
    class="index-materials-view"
    v-if="materialsStore.course"
  >
    <the-sidebar-layout>
      <template #sidebar>
        <div class="index-materials-view__tree">
          <router-link
            class="index-materials-view__tree__back-button"
            to="/materials"
          >
            &#8249; Ко всем курсам
          </router-link>
          <span
            class="index-materials-view__tree__students"
            v-if="globalStore._userRole === 'teacher'"
            @click="assignStudentsStore.modalVisible = true"
          >
            Ученики курса ({{ assignStudentsStore.studentsCount }})
          </span>
          <h2 class="index-materials-view__tree__title">
            {{ materialsStore.course.name }}
          </h2>
          <!-- <div class="index-materials-view__tree__author">
            <div class="index-materials-view__tree__author__avatar">
              <user-avatar :name="materialsStore.course.author.name" />
            </div>
            <div class="index-materials-view__tree__author__name">
              <span>{{ materialsStore.course.author.name }}</span>
            </div>
          </div> -->
          <materials-tree :data="materialsStore.materialsTree" />
        </div>
      </template>
      <template #content>
        <div class="index-materials-view__content">
          <router-view />
        </div>
      </template>
    </the-sidebar-layout>
  </div>
  <sure-modal
    v-model:visible="assignStudentsStore.modalVisible"
    @confirm="assignStudentsStore.save()"
  >
    <template #title>
      <h3>Ученики курса</h3>
    </template>
    <template #text>
      <div class="students-modal">
        <div class="students-modal__search">
          <search-field v-model="assignStudentsStore.search" />
        </div>
        <br />
        <div class="students-modal__list">
          <check-list
            :items="assignStudentsStore.students"
            v-model="assignStudentsStore.selectedStudentIds"
            multiple
            item-label-key="name,username"
            item-key="id"
          />
        </div>
      </div>
    </template>
  </sure-modal>
</template>

<script lang="ts" setup>
import { useMaterialsStore } from '../stores/materials'
import MaterialsTree from '../components/materials-tree.vue'
import { computed } from 'vue'
import { useGlobalStore } from '@/store'
import { useAssignStudentsStore } from '../stores/assign-student'

const materialsStore = useMaterialsStore()
const assignStudentsStore = useAssignStudentsStore()
const globalStore = useGlobalStore()
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
