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
import { computed, ref, watch } from 'vue'

const route = useRoute()
const createCourseStore = useCreateCourseStore()

const chapterSlug = computed(() => route.params.chapterSlug as string)
const materialSlug = computed(() => route.params.materialSlug as string)

const currentMaterial = ref<Material>()

watch(
  () => createCourseStore.course?.id,
  async () => {
    currentMaterial.value = (await createCourseStore.getMaterial(
      chapterSlug.value,
      materialSlug.value
    )) as Material
  },
  { immediate: true }
)
</script>
