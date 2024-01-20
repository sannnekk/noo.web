<template>
  <div class="index-view">
    <div class="index-view__header">
      <div class="index-view__header__search">
        <search-field v-model="materialsStore.search" />
      </div>
      <div
        class="index-view__header__create"
        v-if="globalStore._userRole === 'teacher'"
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
      v-if="materialsStore.courses.length > 0"
    >
      <div
        class="col-md-4"
        v-for="course in materialsStore.courses"
        :key="course.id"
      >
        <course-card
          :to="`/materials/${course.slug}`"
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
    <div v-else>
      <br />
      <br />
      <p style="text-align: center; color: var(--text-light)">
        Курсы не найдены
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import CommonButton from '@/components/form/common-button.vue'
import { useMaterialsStore } from '../stores/materials'
import { useGlobalStore } from '@/store'

const materialsStore = useMaterialsStore()
const globalStore = useGlobalStore()
</script>

<style scoped lang="sass">
.index-view
  padding: 1rem

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
