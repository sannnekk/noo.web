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
        v-if="Core.Context.User?.role === 'teacher'"
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
        class="col-md-4"
        v-for="course in coursesStore.results"
        :key="course.id"
      >
        <course-card
          :to="`/courses/${course.slug}`"
          :image="
            course.images[0]?.src || 'https://via.placeholder.com/300x200'
          "
          :title="course.name"
          :description="course.description"
          :author="course.author.name"
          :author-avatar="course.author.avatar"
          :author-link="`/users/${course.author.id}`"
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
    <div v-else>
      <br />
      <br />
      <p style="text-align: center; color: var(--text-light)">
        Курсы не найдены
      </p>
    </div>
    <div
      class="index-view__pagination"
      v-if="coursesStore.resultsMeta.total > 0"
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
