<template>
  <div
    class="material-view"
    v-if="currentMaterial"
  >
    <div class="form-group">
      <form-input
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
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useCreateCourseStore } from '../stores/create-course'
import { computed } from 'vue'
import type { Material } from '@/types/entities/Material'

const createCourseStore = useCreateCourseStore()
const route = useRoute()

const currentMaterial = computed({
  get: () =>
    createCourseStore.getMaterial(
      route.params.chapterSlug as string,
      route.params.materialSlug as string
    ),
  set: (value) =>
    createCourseStore.setMaterial(
      route.params.chapterSlug as string,
      value as Material
    )
})
</script>

<style scoped lang="sass">
.material-view
  &__label
    display: block
    margin-top: 0.5rem
    color: var(--text-light)
    font-size: 0.8em
</style>
