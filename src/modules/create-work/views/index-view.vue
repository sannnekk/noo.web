<template>
  <div class="index-create-work-view">
    <the-sidebar-layout>
      <template #sidebar>
        <div class="index-create-work-view__sidebar">
          <h2 class="index-create-work-view__sidebar__title">Вопросы</h2>
          <div class="index-create-work-view__sidebar__general-info">
            <router-link
              :to="`/create-work${$route.params.workSlug}/general-info`"
            >
              Общая информация
            </router-link>
          </div>
          <div class="index-create-work-view__sidebar__list">
            <create-work-task-list
              v-model="createWorkStore.work.tasks"
              :current-task-id="taskId"
            />
          </div>
          <div
            class="index-create-work-view__sidebar__create-button"
            v-if="createWorkStore.work.tasks.length !== 0"
          >
            <common-button
              design="primary"
              @click="createWorkStore.submitWork()"
            >
              {{
                $route.params.workSlug && $route.params.workSlug.length
                  ? 'Обновить работу'
                  : 'Опубликовать'
              }}
            </common-button>
          </div>
        </div>
      </template>
      <template #content>
        <div class="index-create-work-view__content">
          <router-view />
        </div>
      </template>
    </the-sidebar-layout>
  </div>
</template>

<script lang="ts" setup>
import CreateWorkTaskList from '../components/create-work-task-list.vue'
import { useCreateWorkStore } from '../stores/create-work'
import { useRoute } from 'vue-router'
import { computed } from 'vue'

const createWorkStore = useCreateWorkStore()
const route = useRoute()

const taskId = computed(() => route.params.taskId as string)

createWorkStore.fetchWork()
</script>

<style lang="sass" scoped>
.index-create-work-view
  &__sidebar
    &__title
      margin-top: 0
      margin-bottom: 0.5em
      font-size: 1.3rem
      font-weight: bold

    &__general-info
      margin-bottom: 1rem

      a
        text-decoration: none
        color: var(--text-light)

        &.router-link-active
          font-weight: bold
          color: var(--dark)

        &:not(.router-link-active):hover
          color: var(--secondary)

    &__create-button
      margin-top: 2rem

      &:deep() button
        justify-content: center
        width: 100%
</style>
