<template>
  <div class="work-view">
    <the-sidebar-layout v-if="worksStore.assignedWork">
      <template #sidebar>
        <div class="work-view__sidebar">
          <h2 class="work-view__sidebar__title">Вопросы</h2>
          <task-list
            :work-id="worksStore.assignedWorkId"
            :is-solved-function="worksStore.taskHasAnswer"
            :base-url="worksStore.baseUrl"
            :tasks="worksStore.assignedWork?.work?.tasks || []"
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
              class="work-view__sidebar__shift-button"
              alignment="stretch"
              design="secondary"
              @click="worksStore.shiftDeadline()"
              v-if="['check', 'solve'].includes(worksStore.mode)"
            >
              {{
                worksStore.mode === 'check'
                  ? 'Сдвинуть дедлайн проверки'
                  : 'Сдвинуть дедлайн сдачи'
              }}
            </common-button>
            <common-button
              alignment="stretch"
              to="/assigned-works"
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
        :to="['admin', 'teacher'].includes(Core.Context.User?.role!) ? '/works' : '/assigned-works'"
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
  <sure-modal
    v-model:visible="worksStore.shiftDeadlineModalVisible"
    @confirm="worksStore.shiftDeadline()"
  >
    <template #title> Сдвинуть дедлайн на 3 дня </template>
    <template #text>
      Вы уверены, что хотите сдвинуть дедлайн?
      <br />
      <br />
      <warning-block> Сдвинуть дедлайн можно только один раз </warning-block>
    </template>
  </sure-modal>
</template>

<script setup lang="ts">
import { Core } from '@/core/Core'
import TaskList from '../components/task-list.vue'
import { useAssignedWorkStore } from '../stores/assigned-work'

const worksStore = useAssignedWorkStore()
</script>

<style scoped lang="sass">
.work-view
  &__sidebar
    &__title
      margin: 0

    &__shift-button
      margin-top: 0.5em
      transform: scale(0.8)

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
../stores/assigned-works
