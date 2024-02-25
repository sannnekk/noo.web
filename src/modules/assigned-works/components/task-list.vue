<template>
  <ul class="task-list">
    <li
      v-for="(task, index) in tasks"
      :key="task.id"
    >
      <router-link :to="`${baseUrl}/${task.slug}`">
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
import type { AssignedWork } from '@/core/data/entities/AssignedWork'
import type { Task } from '@/core/data/entities/Task'

interface Props {
  baseUrl: string
  tasks: Task[]
  workId: AssignedWork['id']
  isSolvedFunction: (task: Task) => boolean
}

defineProps<Props>()
</script>

<style scoped lang="sass">
.task-list
  margin: 1em 0
  padding: 0
  display: flex
  gap: 0.2em
  flex-wrap: wrap
  list-style: none

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
      color: var(--dark)

      &:hover
        background-color: var(--text-light)
        color: var(--lightest) !important

      &.router-link-active
        font-weight: bold
        color: var(--dark)
        background-color: var(--primary)
        border-color: var(--primary)
</style>
@/core/data/entities/AssignedWork@/core/data/entities/Task
