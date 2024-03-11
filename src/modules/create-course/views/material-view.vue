<template>
  <div
    class="material-view"
    v-if="currentMaterial"
  >
    <div class="form-group">
      <form-input
        type="text"
        v-model="currentMaterial.name"
        label="Название материала"
      />
    </div>
    <div class="form-group">
      <label class="material-view__label">Описание</label>
      <text-area v-model="currentMaterial.description" />
    </div>
    <div class="form-group">
      <label class="material-view__label">Содержание:</label>
      <rich-text-area v-model="currentMaterial.content" />
    </div>
    <br />
    <div class="form-group">
      <file-input
        label="Файлы, прикрепленные к материалу"
        :max-count="5"
        :allowed-mime-types="['application/pdf', 'image/jpeg', 'image/png']"
        v-model="currentMaterial.files"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useCreateCourseStore } from '../stores/create-course'

const route = useRoute()
const createCourseStore = useCreateCourseStore()

const currentMaterial = createCourseStore.getMaterial(
  route.params.chapterSlug as string,
  route.params.materialSlug as string
)
</script>

<style scoped lang="sass">
.material-view
  &__label
    display: block
    margin-top: 0.5rem
    color: var(--text-light)
    font-size: 0.8em
</style>
