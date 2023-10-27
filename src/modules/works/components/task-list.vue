<template>
  <ol class="task-list">
    <li
      v-for="task in tasks"
      :key="task.id"
    >
      <router-link :to="`${baseUrl}/${task.slug}`">
        <inline-icon
          class="task-list__icon"
          v-show="isSolvedFunction(workId, task)"
          name="check-green"
        />
        {{ task.name }}
      </router-link>
    </li>
  </ol>
</template>

<script setup lang="ts">
import type { AssignedWork } from '@/types/entities/AssignedWork'
import type { Task } from '@/types/entities/Task'

interface Props {
  baseUrl: string
  tasks: Task[]
  workId: AssignedWork['id']
  isSolvedFunction: (workId: AssignedWork['id'], task: Task) => boolean
}

defineProps<Props>()
</script>

<style scoped lang="sass">
.task-list
  margin: 1em 0
  padding-left: 1.3em

  &__icon
    font-size: 1.3em
    transform: translateY(0.2em)

  & > li
    margin-bottom: 0.1rem

    a
      text-decoration: none
      color: var(--text-light)
      padding-left: 0.2em
      display: inline-block

      &.router-link-active
        font-weight: bold
        color: var(--dark)

      &:hover
        color: var(--secondary)
</style>
