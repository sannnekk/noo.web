<template>
  <div class="work-view">
    <the-sidebar-layout>
      <template #sidebar>
        <div class="work-view__sidebar">
          <div class="work-view__sidebar__info">
            <work-info />
          </div>
          <div class="work-view__sidebar__tasks">
            <task-list />
          </div>
          <div class="work-view__sidebar__comments-link">
            <comments-link />
          </div>
          <div class="work-view__sidebar__score">
            <work-score />
          </div>
          <div class="work-view__sidebar__actions">
            <work-actions />
          </div>
          <div class="work-view__sidebar__autosave">
            <autosave-block />
          </div>
          <div class="work-view__sidebar__people">
            <work-people />
          </div>
        </div>
      </template>
      <template #content>
        <div
          class="work-view__content"
          v-if="assignedWorkStore.assignedWork"
        >
          <h2 class="task-view__title">
            {{ assignedWorkStore.assignedWork?.work?.name }}
          </h2>
          <router-view :key="$route.fullPath" />
        </div>
        <div
          class="work-view__not-found"
          v-else
        >
          <h1 class="work-view__not-found__title">Работа не найдена</h1>
        </div>
      </template>
    </the-sidebar-layout>
  </div>
</template>

<script setup lang="ts">
import workInfo from '../components/single-work/work-info.vue'
import TaskList from '../components/single-work/task-list.vue'
import commentsLink from '../components/single-work/comments-link.vue'
import AutosaveBlock from '../components/single-work/autosave-block.vue'
import WorkScore from '../components/single-work/work-score.vue'
import workActions from '../components/single-work/work-actions.vue'
import WorkPeople from '../components/single-work/work-people.vue'
import { useAssignedWorkStore } from '../stores/assigned-work'
import { setPageTitle } from '@/core/utils/setPageTitle'
import { onUnmounted, watch } from 'vue'
import { HOT_KEYS } from '../utils/hotkeys'
import { registerHotkeys } from '@/core/device/Hotkeys'

const assignedWorkStore = useAssignedWorkStore()

assignedWorkStore.fetchAssignedWork()
assignedWorkStore.autoSave.reset()

watch(
  () => assignedWorkStore.assignedWork,
  () => {
    if (assignedWorkStore.assignedWork?.work) {
      setPageTitle(assignedWorkStore.assignedWork.work.name)
    }
  },
  { deep: true, immediate: true }
)

const unregister = registerHotkeys(HOT_KEYS)
onUnmounted(() => {
  unregister()
})
</script>

<style scoped lang="sass">
.work-view
  &__not-found
    display: flex
    flex-direction: column
    align-items: center
    justify-content: center
    height: 100%

    &__title
      margin: 0
      margin-top: 3em
      font-weight: 500

    &__link
      margin: 2em 0
</style>
