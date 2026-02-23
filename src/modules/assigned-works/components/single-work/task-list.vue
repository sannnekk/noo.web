<template>
  <ul
    class="task-list"
    v-if="assignedWorkStore.assignedWork?.work"
  >
    <li
      v-for="(task, index) in assignedWorkStore.assignedWork.work.tasks"
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
        <span v-else>{{ index + 1 }}</span>
      </router-link>
    </li>
  </ul>
</template>

<script setup lang="ts">
import { useAssignedWorkStore } from '../../stores/assigned-work'

const assignedWorkStore = useAssignedWorkStore()

const scoreFunction = assignedWorkStore.taskScoreStatus
const isSolvedFunction = assignedWorkStore.taskHasAnswer
</script>

<style scoped lang="sass">
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
