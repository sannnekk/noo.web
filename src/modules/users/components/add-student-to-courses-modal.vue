<template>
  <sure-modal
    v-model:visible="visibilityModel"
    @confirm="$emit('add', chosenCourseSlugs)"
  >
    <template #title> Добавить ученика на курсы </template>
    <template #text>
      <div class="add-student-to-courses__search">
        <search-field
          v-model="courseSearch.pagination.value.search"
          :is-loading="courseSearch.isListLoading.value"
        />
      </div>
      <div class="add-student-to-courses__list">
        <check-list
          :items="courseSearch.results.value"
          v-model="chosenCourseSlugs"
          item-key="slug"
          item-label-key="name"
          multiple
        />
      </div>
      <div class="add-student-to-courses__pagination">
        <list-pagination
          v-model:page="courseSearch.pagination.value.page"
          :limit="courseSearch.pagination.value.limit"
          :total="courseSearch.resultsMeta.value.total"
        />
      </div>
    </template>
  </sure-modal>
</template>

<script setup lang="ts">
import { useSearch } from '@/composables/useSearch'
import { Core } from '@/core/Core'
import type { Pagination } from '@/core/data/Pagination'
import type { Course } from '@/core/data/entities/Course'
import type { User } from '@/core/data/entities/User'
import { computed, ref, watch } from 'vue'

interface Props {
  courseSlugs: Course['slug'][]
  userId: User['id']
  visible?: boolean
}

interface Emits {
  (event: 'add', courseSlugs: Course['slug'][]): void
  (event: 'update:visible', value: boolean | undefined): void
}

const props = defineProps<Props>()
const emits = defineEmits<Emits>()

const courseService = Core.Services.Course
const uiService = Core.Services.UI

const courseSearch = useSearch(fetchCourses)

const chosenCourseSlugs = ref(props.courseSlugs)

watch(
  () => props.visible,
  () => (chosenCourseSlugs.value = props.courseSlugs)
)

const visibilityModel = computed({
  get: () => props.visible,
  set: (value) => emits('update:visible', value)
})

async function fetchCourses(pagination?: Pagination) {
  try {
    return courseService.getCourses(pagination)
  } catch (error: any) {
    uiService.openErrorModal('Ну удалось получить список курсов', error.message)
  }
}
</script>

<style scoped lang="sass">
.add-student-to-courses
	&__list
		margin-top: 1em
</style>
