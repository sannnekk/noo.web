<template>
  <div class="index-materials-view">
    <the-sidebar-layout>
      <template #sidebar>
        <div class="index-materials-view__tree">
          <router-link
            class="index-materials-view__tree__back-button"
            to="/materials"
          >
            &#8249; Ко всем курсам
          </router-link>
          <h2 class="index-materials-view__tree__title">
            {{ course?.name }}
          </h2>
          <div class="index-materials-view__tree__author">
            <div class="index-materials-view__tree__author__avatar">
              <user-avatar :name="course?.author.name" />
            </div>
            <div class="index-materials-view__tree__author__name">
              <router-link :to="`/users/${course?.author.id}`">{{
                course?.author.name
              }}</router-link>
            </div>
          </div>
          <materials-tree :data="materialsTree" />
        </div>
      </template>
      <template #content>
        <div class="index-materials-view__content">
          <router-view />
        </div>
      </template>
    </the-sidebar-layout>
  </div>
</template>

<script lang="ts" setup>
import { useMaterialsStore } from '../stores/materials'
import MaterialsTree from '../components/materials-tree.vue'
import { useRoute } from 'vue-router'

const materialsStore = useMaterialsStore()
const route = useRoute()

const courseId = route.params.courseId as string

const course = materialsStore.getCourseById(courseId)
const materialsTree = materialsStore.getMaterialsTree(courseId)
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

        a
          text-decoration: none
          color: var(--text-light)

          &:hover
            color: var(--secondary)
</style>
