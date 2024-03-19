<template>
  <div
    class="material-view"
    v-if="courseStore.material"
    v-auto-animate
  >
    <p
      v-if="!courseStore.iDontSeeWorks"
      class="material-view__i-dont-see-works"
      @click="courseStore.iDontSeeWorks = true"
    >
      Не видно работ?
    </p>
    <warning-block
      v-if="Core.Context.User?.role === 'student' && courseStore.iDontSeeWorks"
      closable
    >
      <b>Вам не видно работ?</b>
      <br />
      1. А они точно есть на этом курсе? Материалы с прикрепленной работой
      помечены иконкой
      <inline-icon
        name="uni-cap"
        style="font-size: 1.5em; vertical-align: middle"
      />
      <br />
      2. Убедитесь, что у вас есть куратор. Возможно, он был добавлен после
      входа в систему. <br />
      3. Попробуйте перезайти. <br />
      4. Если ничего не помогло, запросите доступ к работам.
      <br /><br />
      <b
        @click="courseStore.iDontSeeWorks = false"
        class="material-view__i-dont-see-works__i-see-works"
        >Уже вижу</b
      >
      или
      <br />
      <br />
      <common-button
        design="warning"
        alignment="stretch"
        @click="courseStore.assignMeWorks()"
      >
        Запросить доступ к работам
      </common-button>
    </warning-block>
    <div class="material-view__header">
      <div class="material-view__header__title">
        <h1>{{ courseStore.material.name }}</h1>
      </div>
      <div
        class="material-view__header__work-link"
        v-if="courseStore.material.workId"
      >
        <common-button
          v-if="courseStore.assignedWorkLink"
          :to="courseStore.assignedWorkLink"
        >
          Перейти к работе
        </common-button>
      </div>
      <div
        class="material-view__header__work-link"
        v-if="Core.Context.User?.role === 'teacher'"
      >
        <common-button @click="assignWorkStore.modalVisible = true">
          {{
            courseStore.material.work ? 'Поменять работу' : 'Присвоить работу'
          }}
        </common-button>
      </div>
    </div>
    <div
      class="material-view__description"
      v-if="courseStore.material.description"
    >
      <div v-html="courseStore.material.description"></div>
    </div>
    <div
      v-else
      class="material-view__separator"
    ></div>
    <div class="material-view__content">
      <rich-text-container :content="courseStore.material.content" />
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
    Выберите материал из дерева слева
  </p>
  <assign-work-modal />
</template>

<script setup lang="ts">
import AssignWorkModal from '../components/assign-work-modal.vue'
import { Core } from '@/core/Core'
import { useCourseStore } from '../stores/course'
import { useAssignWorkToMaterialStore } from '../stores/assign-work'

const courseStore = useCourseStore()
const assignWorkStore = useAssignWorkToMaterialStore()

courseStore.fetchAssignedWorkToMaterial()
</script>

<style scoped lang="sass">
.material-view
  &__i-dont-see-works
    font-size: 1.1em
    color: var(--warning)
    margin: 0
    cursor: pointer

    &:hover
      text-decoration: underline

    &__i-see-works
      cursor: pointer
      color: var(--secondary)
      font-weight: bold

      &:hover
        text-decoration: underline

  &__header
    width: 100%
    display: flex
    justify-content: space-between
    align-items: center

    @media screen and (max-width: 768px)
      flex-direction: column

    &__title
      flex: 1

    &__work-link

      @media screen and (max-width: 768px)
        margin-bottom: 1em

      .v-button:deep()
        button
          font-size: 1.05em

  &__description
    padding: 1rem
    margin-right: 1rem
    border-radius: var(--border-radius)
    border: 1px solid var(--secondary)
    background: var(--secondary)
    margin-bottom: 1rem

  &__separator
    height: 1px
    background-color: var(--border-color)
    margin-top: 1em
    margin-bottom: 1rem

  &__content:deep()
    padding-right: 1em

    iframe
      width: 100%
      aspect-ratio: 16 / 9
      border-radius: var(--border-radius)

  &__files
    margin-top: 1em
    padding-top: 1em
    border-top: 1px solid var(--border-color)

.assign-work-to-material-modal
  &__current-work-link
    text-decoration: none
    color: var(--dark)
    font-weight: bold

    &:hover
      text-decoration: underline

  &__deadlines
    display: flex
    justify-content: space-between
    gap: 1em
</style>
../stores/courses
