<template>
  <div class="course-assignments-view">
    <div class="course-assignments-view__header">
      <div class="course-assignments-view__header__search">
        <search-field
          v-model="assignmentSearch.pagination.value.search"
          :is-loading="assignmentSearch.isListLoading.value"
        />
      </div>
    </div>
    <div
      class="row"
      v-if="
        assignmentSearch.resultsMeta.value.total > 0 &&
        !assignmentSearch.isListLoading.value
      "
      v-auto-animate
    >
      <div
        class="col-md-6 col-lg-4"
        v-for="assignment in assignments"
        :key="assignment.id"
      >
        <course-card
          :course="assignment.course!"
          :assignment="assignment"
          :is-pinned="assignment.isPinned"
          @archive="onAssignmentArchive($event)"
          @unarchive="onAssignmentUnarchive($event)"
          @pin="onAssignmentPin($event)"
          @unpin="onAssignmentUnpin($event)"
        />
      </div>
    </div>
    <div
      class="course-assignments-view__loading"
      v-else-if="assignmentSearch.isListLoading.value"
    >
      <loader-icon contrast />
    </div>
    <div
      class="course-assignments-view__nothing-found"
      v-else
    >
      <div class="course-assignments-view__nothing-found__image">
        <nothing-found-image
          class="course-assignments-view__nothing-found__image__img"
        />
      </div>
      <p class="course-assignments-view__nothing-found__text">
        Курсы не найдены. Попробуйте перезагрузить страницу
      </p>
    </div>
    <div class="course-assignments-view__pagination">
      <list-pagination
        v-model:page="assignmentSearch.pagination.value.page"
        :total="assignmentSearch.resultsMeta.value.total"
        :limit="assignmentSearch.pagination.value.limit"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useSearch } from '@/composables/useSearch'
import { useCoursesStore } from '../stores/courses'
import type { CourseAssignment } from '@/core/data/entities/CourseAssignment'
import { computed } from 'vue'

interface Props {
  archived?: boolean
}

interface Emits {
  (event: 'trigger-search'): void
}

const props = defineProps<Props>()
const emits = defineEmits<Emits>()

const coursesStore = useCoursesStore()

const assignmentSearch = useSearch(coursesStore.fetchAssignments, {
  initialPagination: {
    limit: 9,
    'filter[isArchived]': {
      type: 'boolean',
      value: props.archived
    }
  },
  immediate: true
})

const assignments = computed(() =>
  [...assignmentSearch.results.value].sort(
    (a, b) => Number(b.isPinned) - Number(a.isPinned)
  )
)

async function onAssignmentArchive(assignment: CourseAssignment) {
  await coursesStore.archiveAssignment(assignment)
  emits('trigger-search')
}

async function onAssignmentUnarchive(assignment: CourseAssignment) {
  await coursesStore.unarchiveAssignment(assignment)
  emits('trigger-search')
}

async function onAssignmentPin(assignment: CourseAssignment) {
  await coursesStore.pinAssignment(assignment)
  emits('trigger-search')
}

async function onAssignmentUnpin(assignment: CourseAssignment) {
  await coursesStore.unpinAssignment(assignment)
  emits('trigger-search')
}
</script>

<style scoped lang="sass">
.course-assignments-view
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
</style>
