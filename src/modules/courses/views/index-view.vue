<template>
  <div
    class="index-view"
    v-auto-animate
  >
    <div class="index-view__header">
      <div class="index-view__header__search">
        <search-field
          v-model="coursesStore.pagination.search"
          :is-loading="coursesStore.isListLoading"
        />
      </div>
      <div
        class="index-view__header__create"
        v-if="Core.Context.roleIs(['teacher'])"
      >
        <common-button
          to="/create-course"
          design="primary"
        >
          Создать курс
        </common-button>
      </div>
    </div>
    <div
      class="row"
      v-if="coursesStore.resultsMeta.total > 0 && !coursesStore.isListLoading"
      v-auto-animate
    >
      <div
        class="col-md-6 col-lg-4"
        v-for="course in coursesStore.results"
        :key="course.id"
      >
        <course-card
          :to="`/courses/${course.slug}`"
          :image="course.images[0]?.src"
          :title="course.name"
          :description="course.description"
          :author="course?.author?.name"
          :slug="course.slug"
        />
      </div>
    </div>
    <div
      class="index-view__loading"
      v-else-if="coursesStore.isListLoading"
    >
      <loader-icon contrast />
    </div>
    <div
      class="index-view__nothing-found"
      v-else
    >
      <div class="index-view__nothing-found__image">
        <nothing-found-image class="index-view__nothing-found__image__img" />
      </div>
      <p class="index-view__nothing-found__text">Курсы не найдены</p>
    </div>
    <div
      class="index-view__pagination"
      v-if="
        coursesStore.resultsMeta.total > 0 &&
        coursesStore.pagination.page &&
        coursesStore.pagination.limit
      "
    >
      <list-pagination
        v-model:page="coursesStore.pagination.page"
        :total="coursesStore.resultsMeta.total"
        :limit="coursesStore.pagination.limit"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import CommonButton from '@/components/form/common-button.vue'
import { useCoursesStore } from '../stores/courses'
import { Core } from '@/core/Core'
import { setPageTitle } from '@/core/utils/setPageTitle'

setPageTitle('Мои курсы')

const coursesStore = useCoursesStore()
</script>

<style scoped lang="sass">
.index-view
  padding: 1rem

  &__loading
    height: 400px
    display: flex
    justify-content: center
    margin-top: 2em
    font-size: 50px

  &__nothing-found
    margin-top: 4em
    text-align: center

    &__image
      display: inline-block
      width: min(90%, 500px)

      &__img
        width: 100%
        height: auto

    &__text
      font-size: 20px
      text-align: center
      color: var(--text-light)

  &__header
    display: flex
    gap: 1em
    margin-bottom: 1em

    @media screen and (max-width: 768px)
      flex-direction: column

    &__search
      flex: 1

      @media screen and (max-width: 768px)
        margin-bottom: 1em

    &__create
      padding-top: 2px

      @media screen and (max-width: 768px)
        margin-bottom: 1em
        font-size: 12px
</style>
