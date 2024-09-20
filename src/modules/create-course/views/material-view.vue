<template>
  <div
    class="material-view"
    v-if="currentMaterial"
  >
    <material-form
      v-model="currentMaterial"
      :subject-id="createCourseStore.course.subject?.id"
    />
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useCreateCourseStore } from '../stores/create-course'
import type { Material } from '@/core/data/entities/Material'

const route = useRoute()
const createCourseStore = useCreateCourseStore()

const currentMaterial = createCourseStore.getMaterial(
  route.params.chapterSlug as string,
  route.params.materialSlug as string
) as Material | undefined
</script>
