<template>
  <div
    class="index-view"
    v-if="courseStudentsStore.course"
  >
    <div class="index-view__header">
      <h3>
        Курс: <b>{{ courseStudentsStore.course.name }}</b>
      </h3>
      <p>
        Всего учеников:
        <b>{{ courseStudentsStore.course.studentIds?.length ?? 0 }}</b>
      </p>
    </div>
    <div class="index-view__tabs">
      <tabs-view
        :titles="['Добавить/убрать учеников', 'Синхронизация через email']"
      >
        <template #tab-0>
          <add-students-view />
        </template>
        <template #tab-1>
          <email-sync-view />
        </template>
      </tabs-view>
    </div>
  </div>
</template>

<script lang="ts" setup>
import addStudentsView from '../components/add-students-view.vue'
import emailSyncView from '../components/email-sync-view.vue'
import { setPageTitle } from '@/core/utils/setPageTitle'
import { useCourseStudentsStore } from '../stores/course-students'

const courseStudentsStore = useCourseStudentsStore()

courseStudentsStore.fetchCourse().then(() => {
  setPageTitle(`Ученики курса "${courseStudentsStore.course?.name ?? '???'}"`)
})
</script>

<style scoped lang="sass">
.index-view
  &__header
    padding: 1em

    h3
      font-weight: normal
      font-size: 0.8em
      margin-bottom: 0

      b
        display: block
        font-size: 2em
</style>
