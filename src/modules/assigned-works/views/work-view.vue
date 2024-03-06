<template>
  <div class="work-view">
    <the-sidebar-layout v-if="assignedWorkStore.assignedWork">
      <template #sidebar>
        <div class="work-view__sidebar">
          <h2 class="work-view__sidebar__title">
            {{ assignedWorkStore.mode === 'check' ? 'Проверка' : 'Работа' }}
          </h2>
          <p v-if="assignedWorkStore.mode === 'solve'"></p>
          <div class="work-view__sidebar__info">
            <p
              v-if="
                Core.Context.User?.role === 'mentor' &&
                assignedWorkStore.assignedWork.checkDeadlineAt
              "
              class="work-view__sidebar__info__check-deadline"
            >
              Дедлайн проверки:
              {{
                useDate(assignedWorkStore.assignedWork.checkDeadlineAt, {
                  precision: 'day'
                }).toBeautiful()
              }}
            </p>
            <p
              class="work-view__sidebar__info__solve-deadline"
              v-if="assignedWorkStore.assignedWork.solveDeadlineAt"
            >
              Дедлайн сдачи:
              {{
                useDate(assignedWorkStore.assignedWork.solveDeadlineAt, {
                  precision: 'day'
                }).toBeautiful()
              }}
            </p>
          </div>
          <task-list
            :work-id="assignedWorkStore.assignedWorkId"
            :is-solved-function="assignedWorkStore.taskHasAnswer"
            :base-url="assignedWorkStore.baseUrl"
            :tasks="assignedWorkStore.assignedWork.work?.tasks || []"
          />
          <p class="work-view__sidebar__score">
            Оценка:
            <b>
              {{
                assignedWorkStore.workScoreText === null
                  ? 'не выставлена'
                  : assignedWorkStore.workScoreText
              }}
            </b>
          </p>
          <div class="work-view__sidebar__submit">
            <common-button
              alignment="stretch"
              @click="assignedWorkStore.submitWork()"
              v-if="['check', 'solve'].includes(assignedWorkStore.mode)"
            >
              {{
                assignedWorkStore.mode === 'check'
                  ? 'Завершить проверку'
                  : 'Завершить работу'
              }}
            </common-button>
            <common-button
              class="work-view__sidebar__save-button"
              alignment="stretch"
              design="inline"
              @click="assignedWorkStore.saveProgress()"
              v-if="['check', 'solve'].includes(assignedWorkStore.mode)"
            >
              Сохранить без сдачи
            </common-button>
            <common-button
              class="work-view__sidebar__shift-button"
              alignment="stretch"
              design="inline"
              @click="assignedWorkStore.shiftDeadline()"
              v-if="['check', 'solve'].includes(assignedWorkStore.mode)"
            >
              {{
                assignedWorkStore.mode === 'check'
                  ? 'Сдвинуть дедлайн проверки'
                  : 'Сдвинуть дедлайн сдачи'
              }}
            </common-button>
            <common-button
              :to="['admin', 'teacher'].includes(Core.Context.User?.role!) ? '/works' : '/assigned-works'"
              alignment="stretch"
              design="inline"
              class="work-view__sidebar__back-button"
            >
              Вернуться к списку работ
            </common-button>
            <div class="work-view__sidebar__people">
              <div class="work-view__sidebar__people__student">
                <label>Ученик: </label>
                <user-card :user="assignedWorkStore.assignedWork.student" />
              </div>
              <div class="work-view__sidebar__people__mentor">
                <label>Проверяющие кураторы: </label>
                <user-card
                  v-for="mentor in assignedWorkStore.assignedWork.mentors"
                  :user="mentor"
                  :key="mentor.id"
                />
              </div>
            </div>
          </div>
        </div>
      </template>
      <template #content>
        <div
          class="work-view__content"
          v-auto-animate
        >
          <h2 class="task-view__title">
            {{ assignedWorkStore.assignedWork?.work?.name }}
          </h2>
          <router-view :key="$route.fullPath" />
        </div>
      </template>
    </the-sidebar-layout>
    <div
      class="work-view__not-found"
      v-else
    >
      <h1 class="work-view__not-found__title">Работа не найдена</h1>
    </div>
  </div>
  <sure-modal
    v-model:visible="assignedWorkStore.sureSubmitModalVisible"
    @confirm="assignedWorkStore.submitWork()"
  >
    <template #title>
      {{
        assignedWorkStore.mode === 'check'
          ? 'Завершить проверку'
          : 'Завершить работу'
      }}
    </template>
    <template #text>
      {{
        assignedWorkStore.mode === 'check'
          ? 'Вы уверены, что хотите завершить проверку?'
          : 'Вы уверены, что хотите завершить работу?'
      }}
      <br />
      <br />
      <warning-block v-if="assignedWorkStore.sureSubmitModalError">
        {{ assignedWorkStore.sureSubmitModalError }}
      </warning-block>
    </template>
  </sure-modal>
  <sure-modal
    v-model:visible="assignedWorkStore.shiftDeadlineModalVisible"
    @confirm="assignedWorkStore.shiftDeadline()"
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
import TaskList from '../components/task-list.vue'
import { Core } from '@/core/Core'
import { useAssignedWorkStore } from '../stores/assigned-work'
import { useDate } from '@/composables/useDate'
import { setPageTitle } from '@/core/utils/setPageTitle'
import { watch } from 'vue'

const assignedWorkStore = useAssignedWorkStore()

assignedWorkStore.fetchAssignedWork()

watch(
  () => assignedWorkStore.assignedWork,
  () => {
    if (assignedWorkStore.assignedWork?.work) {
      setPageTitle(assignedWorkStore.assignedWork.work.name)
    }
  },
  { deep: true, immediate: true }
)
</script>

<style scoped lang="sass">
.work-view
  &__sidebar
    &__title
      margin: 0

    &__info
      margin-top: 1em
      color: var(--text-light)
      font-size: 0.9em

      &__check-deadline
        margin: 0

      &__solve-deadline
        margin: 0

      &__student-name
        margin: 0

    &__save-button
      margin-top: 0.5em
      transform: scale(0.8)

    &__shift-button
      margin-top: 0.5em
      transform: scale(0.8)

    &__back-button
      font-size: 0.8em

    &__people
      margin-top: 1em
      padding-top: 1em
      border-top: 1px solid var(--border-color)
      font-size: 0.8em

      label
        color: var(--text-light)
        margin: 0
        margin-bottom: 0.5em
        display: inline-block

      &__student
        margin-bottom: 1em

      &__mentor
        margin-bottom: 1em

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
