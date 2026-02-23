<template>
  <entity-select-input
    :label="label"
    :fetch-function="fetchCourses"
    :label-keys="['subject.name', 'name']"
    :max-count="maxCount ?? 1"
    v-model="courseModel"
  />
</template>

<script setup lang="ts">
import { Core } from '@/core/Core'
import type { Pagination } from '@/core/data/Pagination'
import type { Course } from '@/core/data/entities/Course'
import { computed } from 'vue'

interface Props {
  label: string
  maxCount?: number
  separator?: string
  modelValue: Course[]
}

interface Emits {
  (event: 'update:modelValue', value: Course[]): void
}

const props = defineProps<Props>()
const emits = defineEmits<Emits>()

const courseService = Core.Services.Course
const uiService = Core.Services.UI

async function fetchCourses(pagination?: Pagination) {
  try {
    return courseService.getCourses(pagination)
  } catch (error: any) {
    uiService.openErrorModal(
      'Произошла ошибка при загрузке курсов',
      error.message
    )
  }
}

const courseModel = computed<Course[]>({
  get: () => props.modelValue || [],
  set: (value) => emits('update:modelValue', value)
})
</script>
