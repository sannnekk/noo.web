<template>
  <div class="work-view">
    <the-sidebar-layout v-if="currentWork">
      <template #sidebar>
        <div class="work-view__sidebar">
          <h2 class="work-view__sidebar__title">Вопросы</h2>
          <task-list
            :work-id="workId"
            :isSolvedFunction="worksStore.taskHasAnswer"
            :base-url="baseUrl"
            :tasks="currentWork?.work?.tasks || []"
          />
          <div class="work-view__sidebar__submit">
            <common-button
              alignment="stretch"
              @click="worksStore.submitWork()"
              v-if="['check', 'solve'].includes(worksStore.mode)"
            >
              {{
                worksStore.mode === 'check'
                  ? 'Завершить проверку'
                  : 'Завершить работу'
              }}
            </common-button>
            <common-button
              alignment="stretch"
              to="/works"
              v-else
            >
              Вернуться к списку работ
            </common-button>
          </div>
        </div>
      </template>
      <template #content>
        <div class="work-view__content">
          <router-view />
        </div>
      </template>
    </the-sidebar-layout>
    <div
      class="work-view__not-found"
      v-else
    >
      <h1 class="work-view__not-found__title">Работа не найдена</h1>
      <common-button
        to="/works"
        alignment="center"
        class="work-view__not-found__link"
      >
        Вернуться к списку работ
      </common-button>
    </div>
  </div>
  <sure-modal
    v-model:visible="worksStore.sureSubmitModalVisible"
    @confirm="worksStore.submitWork()"
  >
    <template #title>
      {{
        worksStore.mode === 'check' ? 'Завершить проверку' : 'Завершить работу'
      }}
    </template>
    <template #text>
      {{
        worksStore.mode === 'check'
          ? 'Вы уверены, что хотите завершить проверку?'
          : 'Вы уверены, что хотите завершить работу?'
      }}
      <br />
      <br />
      <warning-block v-if="worksStore.sureSubmitModalError">
        {{ worksStore.sureSubmitModalError }}
      </warning-block>
    </template>
  </sure-modal>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import TaskList from '../components/task-list.vue'
import { useWorksStore } from '../stores/works'
import { computed } from 'vue'

const worksStore = useWorksStore()
const route = useRoute()

const workId = computed(() => route.params.workId as string)
const mode = computed(() => route.params.mode as string)
const taskId = computed(() => route.params.taskId as string)

const baseUrl = computed(() => `/works/${workId.value}/${mode.value}`)

const currentWork = computed(() => worksStore.getWork(workId.value))
</script>

<style scoped lang="sass">
.work-view
  &__sidebar
    &__title
      margin: 0

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
