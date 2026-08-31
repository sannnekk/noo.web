<template>
  <div
    class="task-list-block"
    v-if="assignedWorkStore.assignedWork?.work"
  >
    <div
      class="task-list-block__filter"
      v-if="tagOptions.length"
    >
      <select-input
        label="Тег"
        :options="tagOptions"
        v-model="selectedTag"
      />
    </div>
    <ul
      class="task-list"
      v-auto-animate
    >
      <li
        v-for="{ task, number } in visibleTasks"
        :key="task.id"
      >
        <router-link
          :to="`${assignedWorkStore.baseUrl}/${task.slug}`"
          :class="{
            success: scoreFunction(task) === 'success',
            warning: scoreFunction(task) === 'warning',
            error: scoreFunction(task) === 'error'
          }"
        >
          <inline-icon
            class="task-list__icon"
            v-if="isSolvedFunction(task)"
            name="check-green"
          />
          <span v-else>{{ number }}</span>
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useAssignedWorkStore } from '../../stores/assigned-work'
import { collectTaskTags, taskHasTag } from '@/core/utils/taskTags'

const ALL_TAGS = ''

const assignedWorkStore = useAssignedWorkStore()

const scoreFunction = assignedWorkStore.taskScoreStatus
const isSolvedFunction = assignedWorkStore.taskHasAnswer

const selectedTag = ref<string>(ALL_TAGS)

const tasks = computed(
  () => assignedWorkStore.assignedWork?.work?.tasks || []
)

/**
 * All the tags used in the work. If there are none, the filter is not shown
 */
const tagOptions = computed(() => {
  const tags = collectTaskTags(tasks.value)

  if (!tags.length) {
    return []
  }

  return [
    { label: 'Все задания', value: ALL_TAGS },
    ...tags.map((tag) => ({ label: tag, value: tag }))
  ]
})

/**
 * Tasks to show, keeping the original task numbers
 */
const visibleTasks = computed(() =>
  tasks.value
    .map((task, index) => ({ task, number: index + 1 }))
    .filter(
      ({ task }) =>
        selectedTag.value === ALL_TAGS || taskHasTag(task, selectedTag.value)
    )
)

// reset the filter if the selected tag is not present in the work anymore
watch(tagOptions, (options) => {
  if (!options.some((option) => option.value === selectedTag.value)) {
    selectedTag.value = ALL_TAGS
  }
})
</script>

<style scoped lang="sass">
.task-list-block
  &__filter
    margin-top: 1em

.task-list
  margin: 1em 0
  padding: 0
  display: flex
  gap: 0.7em
  flex-wrap: wrap
  list-style: none
  max-height: 305px
  overflow-y: auto

  &__icon
    font-size: 1.3em

  & > li
    margin: 0
    padding: 0

    a
      font-weight: 500
      display: grid
      place-items: center
      width: 35px
      height: 35px
      border-radius: var(--border-radius)
      border: 1px solid var(--border-color)
      text-decoration: none
      font-weight: normal
      color: var(--form-text-color)

      &.success
        border-width: 2px
        border-color: var(--success) !important

      &.warning
        border-width: 2px
        border-color: #ffe400 !important

      &.error
        border-width: 2px
        border-color: var(--danger) !important

      &:not(.router-link-active):hover
        background-color: var(--text-light)
        color: var(--lightest) !important

      &.router-link-active
        font-weight: bold
        color: var(--dark)
        background-color: var(--primary)
        border-color: var(--primary)
</style>
