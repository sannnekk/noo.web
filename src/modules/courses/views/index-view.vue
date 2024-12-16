<template>
  <div
    class="index-view"
    v-auto-animate
  >
    <div
      class="index-view__courses"
      v-if="Core.Context.roleIs(['admin', 'teacher', 'mentor', 'assistant'])"
    >
      <courses-view />
    </div>
    <div
      class="index-view__course-assignments"
      v-else
    >
      <tabs-view
        v-model:tab-index="coursesStore.currentTabIndex"
        :titles="['Все', 'Архив']"
      >
        <template #tab-0>
          <course-assignments-view
            @trigger-search="triggerSearch()"
            :key="searchRefreshKey"
          />
        </template>
        <template #tab-1>
          <course-assignments-view
            @trigger-search="triggerSearch()"
            :archived="true"
            :key="searchRefreshKey"
          />
        </template>
      </tabs-view>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import CourseAssignmentsView from '../components/course-assignments-view.vue'
import coursesView from '../components/courses-view.vue'
import { useCoursesStore } from '../stores/courses'
import { Core } from '@/core/Core'
import { setPageTitle } from '@/core/utils/setPageTitle'

setPageTitle('Мои курсы')

const coursesStore = useCoursesStore()

const searchRefreshKey = ref(0)

function triggerSearch() {
  searchRefreshKey.value++
}
</script>
