<template>
  <div class="task-form-view">
    <create-work-task-form
      v-if="task"
      v-model="task"
      :checking-strategy-options="createWorkStore.checkingStrategyOptions"
      @remove-task="createWorkStore.removeTask(taskSlug)"
    />
    <p v-else>Создайте задание</p>
  </div>
</template>

<script setup lang="ts">
import CreateWorkTaskForm from '@/modules/create-work/components/create-work-task-form.vue'
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
</style>
