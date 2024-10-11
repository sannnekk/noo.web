<template>
  <div
    class="material-view"
    v-if="courseStore.material"
    v-auto-animate
  >
    <div class="material-view__header">
      <div class="material-view__header__title">
        <h1>{{ courseStore.material.name }}</h1>
      </div>
    </div>
    <div
      class="material-view__change-assigned-work"
      v-if="Core.Context.roleIs(['teacher', 'admin'])"
    >
      <p v-if="courseStore.material.work">
        Присвоенная работа:
        <router-link :to="`/create-work${courseStore.material.work.slug}`">
          {{ courseStore.material.work.name }}
        </router-link>
        <br />
        <span v-if="courseStore.material.workSolveDeadline">
          Дедлайн сдачи:
          <b>{{
            useDate(courseStore.material.workSolveDeadline, {
              precision: 'day'
            }).toBeautiful()
          }}</b>
        </span>
        <span v-if="courseStore.material.workCheckDeadline">
          <br />
          Дедлайн проверки:
          <b>{{
            useDate(courseStore.material.workCheckDeadline, {
              precision: 'day'
            }).toBeautiful()
          }}</b>
        </span>
      </p>
      <p v-else>Работа не присвоена</p>
      <div class="material-view__change-assigned-work__actions">
        <common-button @click="assignWorkStore.modalVisible = true">
          {{
            courseStore.material.work ? 'Поменять работу' : 'Присвоить работу'
          }}
        </common-button>
        <common-button
          v-if="courseStore.material.work"
          @click="assignWorkStore.unassignModalVisible = true"
          design="secondary"
        >
          Открепить работу
        </common-button>
      </div>
    </div>
    <div
      class="material-view__assigned-work"
      v-if="courseStore.material.workId && Core.Context.roleIs(['student'])"
    >
      <div class="material-view__assigned-work__link">
        <common-button @click="courseStore.assignMeWork()">
          К работе
        </common-button>
      </div>
      <div class="material-view__assigned-work__progress">
        <assigned-work-progress :workId="courseStore.material.workId" />
      </div>
    </div>
    <div
      class="material-view__description"
      v-if="courseStore.material.description"
    >
      <div v-html="courseStore.material.description"></div>
    </div>
    <div class="material-view__content">
      <rich-text-container :content="courseStore.material.content" />
    </div>
    <div
      class="material-view__reactions"
      v-if="Core.Context.roleIs(['student'])"
    >
      <user-reactions
        :reactions="{
          check: 0,
          thinking: 0
        }"
        :loading="courseStore.reactionLoading"
        :my-reaction="courseStore.material.myReaction"
        @react="courseStore.reactToMaterial(courseStore.material.id, $event)"
        hide-numbers
      />
      <p class="material-view__reactions__hint">
        ✅ - тема пройдена, 🤔 - стоит вернуться
        <br />
        Эти реакции видны только вам. Они помогают Вам понять, что вы уже
        прошли, а к чему еще стоит вернуться.
      </p>
    </div>
    <div
      class="material-view__poll"
      v-if="courseStore.material.pollId"
    >
      <h3>К этому материалу прикреплен опрос</h3>
      <p v-if="courseStore.material.poll">
        {{ courseStore.material.poll.title }}
        <br />
        {{ courseStore.material.poll.description }}
      </p>
      <common-button
        design="primary"
        :to="`/poll/${courseStore.material.pollId}`"
      >
        Пройти опрос
      </common-button>
    </div>
    <div
      class="material-view__files"
      v-if="courseStore.material.files.length"
    >
      <file-list
        :files="courseStore.material.files"
        label="Файлы курса"
        :actions="['download']"
      />
    </div>
  </div>
  <p
    class="no-material-selected"
    v-else
  >
    Выберите материал из списка
    <!-- <span v-if="lastNotUnderstoodLink">или</span>
    <common-button
      v-if="lastNotUnderstoodLink"
      class="no-material-selected__action"
      design="inline"
      :to="lastNotUnderstoodLink"
    >
      Перейти на последний непонятый материал
    </common-button>
    <span v-if="lastUnderstoodLink">или</span>
    <common-button
      v-if="lastUnderstoodLink"
      class="no-material-selected__action"
      design="inline"
      :to="lastUnderstoodLink"
    >
      Перейти на последний пройденный материал
    </common-button> -->
  </p>
  <assign-work-modal />
  <unassign-work-modal />
</template>

<script setup lang="ts">
import UnassignWorkModal from '../components/unassign-work-modal.vue'
import AssignWorkModal from '../components/assign-work-modal.vue'
import { useDate } from '@/composables/useDate'
import { Core } from '@/core/Core'
import { useCourseStore } from '../stores/course'
import { useAssignWorkToMaterialStore } from '../stores/assign-work'

const courseStore = useCourseStore()
const assignWorkStore = useAssignWorkToMaterialStore()
</script>

<style scoped lang="sass">
.no-material-selected
  &__action
    margin: 0.5em 0

.material-view
  &__change-assigned-work
    margin-bottom: 1em

    a
      color: var(--lila)
      text-decoration: none

      &:hover
        text-decoration: underline

    &__actions
      display: flex
      gap: 1em
      margin-top: 1em

      &:deep() > div
        width: fit-content

  &__assigned-work
    display: flex
    gap: 1em
    align-items: center
    margin-bottom: 1em

  &__description
    padding: 1em
    margin: 1em 0
    border-radius: var(--border-radius)
    border: 1px solid var(--secondary)
    background: var(--secondary)
    margin-bottom: 1rem

  &__content
    &:deep()
      padding-right: 1em

      .quill-editor__content
        padding: 0

    iframe
      width: 100%
      aspect-ratio: 16 / 9
      border-radius: var(--border-radius)

  &__reactions
    margin-top: 1em
    margin-bottom: 0.5em

    &__hint
      font-size: 0.8em
      color: var(--text-light)
      margin-top: 0.5em

  &__files
    margin-top: 1em
    padding-top: 1em
    border-top: 1px solid var(--border-color)

    &:deep()
      .file-list__body
        padding-left: 0
        padding-right: 0
</style>
