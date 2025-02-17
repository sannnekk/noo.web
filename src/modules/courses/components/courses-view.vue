<template>
  <tabs-view
    v-if="Core.Context.roleIs(['teacher'])"
    :titles="['Мои курсы', 'Все курсы']"
    v-model:tab-index="coursesStore.teacherTabIndex"
  >
    <template #tab-0>
      <div class="courses-view">
        <div class="courses-view__header">
          <div class="courses-view__header__search">
            <search-field
              v-model="coursesStore.ownSearch.pagination.search"
              :is-loading="coursesStore.ownSearch.isListLoading"
            />
          </div>
          <div
            class="courses-view__header__create"
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
          v-if="
            coursesStore.ownSearch.resultsMeta.total > 0 &&
            !coursesStore.ownSearch.isListLoading
          "
          v-auto-animate
        >
          <div
            class="col-md-6 col-lg-4"
            v-for="course in coursesStore.ownSearch.results"
            :key="course.id"
          >
            <course-card :course="course" />
          </div>
        </div>
        <div
          class="courses-view__loading"
          v-else-if="coursesStore.ownSearch.isListLoading"
        >
          <loader-icon contrast />
        </div>
        <div
          class="courses-view__nothing-found"
          v-else
        >
          <div class="courses-view__nothing-found__image">
            <nothing-found-image
              class="courses-view__nothing-found__image__img"
            />
          </div>
          <p class="courses-view__nothing-found__text">Курсы не найдены</p>
        </div>
        <div
          class="courses-view__pagination"
          v-if="
            coursesStore.ownSearch.resultsMeta.total > 0 &&
            coursesStore.ownSearch.pagination.page &&
            coursesStore.ownSearch.pagination.limit
          "
        >
          <list-pagination
            v-model:page="coursesStore.ownSearch.pagination.page"
            :total="coursesStore.ownSearch.resultsMeta.total"
            :limit="coursesStore.ownSearch.pagination.limit"
          />
        </div>
      </div>
    </template>
    <template #tab-1>
      <div class="courses-view">
        <div class="courses-view__header">
          <div class="courses-view__header__search">
            <search-field
              v-model="coursesStore.allSearch.pagination.search"
              :is-loading="coursesStore.allSearch.isListLoading"
            />
          </div>
        </div>
        <div class="courses-view__filters">
          <search-filters
            :filters="filters"
            v-model:pagination="coursesStore.allSearch.pagination"
          />
        </div>
        <div
          class="row"
          v-if="
            coursesStore.allSearch.resultsMeta.total > 0 &&
            !coursesStore.allSearch.isListLoading
          "
          v-auto-animate
        >
          <div
            class="col-md-6 col-lg-4"
            v-for="course in coursesStore.allSearch.results"
            :key="course.id"
          >
            <course-card :course="course" />
          </div>
        </div>
        <div
          class="courses-view__loading"
          v-else-if="coursesStore.allSearch.isListLoading"
        >
          <loader-icon contrast />
        </div>
        <div
          class="courses-view__nothing-found"
          v-else
        >
          <div class="courses-view__nothing-found__image">
            <nothing-found-image
              class="courses-view__nothing-found__image__img"
            />
          </div>
          <p class="courses-view__nothing-found__text">Курсы не найдены</p>
        </div>
        <div
          class="courses-view__pagination"
          v-if="
            coursesStore.allSearch.resultsMeta.total > 0 &&
            coursesStore.allSearch.pagination.page &&
            coursesStore.allSearch.pagination.limit
          "
        >
          <list-pagination
            v-model:page="coursesStore.allSearch.pagination.page"
            :total="coursesStore.allSearch.resultsMeta.total"
            :limit="coursesStore.allSearch.pagination.limit"
          />
        </div>
      </div>
    </template>
  </tabs-view>
  <div
    class="courses-view-mentor"
    v-else
  >
    <div class="courses-view">
      <div class="courses-view__header">
        <div class="courses-view__header__search">
          <search-field
            v-model="coursesStore.allSearch.pagination.search"
            :is-loading="coursesStore.allSearch.isListLoading"
          />
        </div>
      </div>
      <div class="courses-view__filters">
        <search-filters
          :filters="filters"
          v-model:pagination="coursesStore.allSearch.pagination"
        />
      </div>
      <div
        class="row"
        v-if="
          coursesStore.allSearch.resultsMeta.total > 0 &&
          !coursesStore.allSearch.isListLoading
        "
        v-auto-animate
      >
        <div
          class="col-md-6 col-lg-4"
          v-for="course in coursesStore.allSearch.results"
          :key="course.id"
        >
          <course-card :course="course" />
        </div>
      </div>
      <div
        class="courses-view__loading"
        v-else-if="coursesStore.allSearch.isListLoading"
      >
        <loader-icon contrast />
      </div>
      <div
        class="courses-view__nothing-found"
        v-else
      >
        <div class="courses-view__nothing-found__image">
          <nothing-found-image
            class="courses-view__nothing-found__image__img"
          />
        </div>
        <p class="courses-view__nothing-found__text">Курсы не найдены</p>
      </div>
      <div
        class="courses-view__pagination"
        v-if="
          coursesStore.allSearch.resultsMeta.total > 0 &&
          coursesStore.allSearch.pagination.page &&
          coursesStore.allSearch.pagination.limit
        "
      >
        <list-pagination
          v-model:page="coursesStore.allSearch.pagination.page"
          :total="coursesStore.allSearch.resultsMeta.total"
          :limit="coursesStore.allSearch.pagination.limit"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Core } from '@/core/Core'
import { useCoursesStore } from '../stores/courses'
import type { SearchFilter } from '@/components/search/filters/SearchFilter'
import { subjectFilter } from '@/core/filters/subject-filter'

const coursesStore = useCoursesStore()

const filters: SearchFilter[] = [subjectFilter()]
</script>

<style scoped lang="sass">
.courses-view
  padding: 1em

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

  &__filters
    margin-bottom: 1em
</style>
