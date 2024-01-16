<template>
  <div class="task-form-view">
    <create-work-task-form
      v-if="taskSlug === 'new'"
      mode="create"
      v-model="(createWorkStore.taskToAdd as Task)"
      @submit="createWorkStore.addTask()"
    />
    <create-work-task-form
      v-else
      mode="update"
      v-model="createWorkStore.taskMap[taskSlug]"
    />
  </div>
</template>

<script setup lang="ts">
import CreateWorkTaskForm from '@/modules/create-work/components/create-work-task-form.vue'
import { useCreateWorkStore } from '../stores/create-work'
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import type { Task } from '@/types/entities/Task'

const createWorkStore = useCreateWorkStore()
const route = useRoute()

const taskSlug = computed(() => route.params.taskSlug as string)
</script>

<style scoped lang="sass">
.task-form-view
  padding: 1rem
  padding-left: 0
</style>
