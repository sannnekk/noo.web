<template>
  <div class="task-form-view">
    <div
      class="task-form-view__form"
      v-if="task"
    >
      <task-create-form v-model="task" />
    </div>
    <div
      class="task-form-view__actions"
      v-if="task"
    >
      <common-button
        @click="createWorkStore.removeTask(taskSlug)"
        design="danger"
        alignment="right"
      >
        Удалить задание
      </common-button>
    </div>
    <div
      class="task-form-view__no-tasks"
      v-else
    >
      <p>Создайте задание</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCreateWorkStore } from '../stores/create-work'
import { useRoute } from 'vue-router'
import { computed } from 'vue'

const createWorkStore = useCreateWorkStore()
const route = useRoute()

const taskSlug = computed(() => route.params.taskSlug as string)
const task = computed(() => createWorkStore.getTask(taskSlug.value))
</script>

<style scoped lang="sass">
.task-form-view
  padding: 1rem
  padding-left: 0

  &__form
    margin-bottom: 1em
</style>
