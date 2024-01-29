<template>
  <div
    class="material-view"
    v-if="materialsStore.material"
  >
    <div class="material-view__header">
      <div class="material-view__header__title">
        <h1>{{ materialsStore.material.name }}</h1>
      </div>
      <div
        class="material-view__header__work-link"
        v-if="materialsStore.material.workId"
      >
        <common-button
          v-if="materialsStore.assignedWorkLink"
          :to="materialsStore.assignedWorkLink"
        >
          Перейти к работе
        </common-button>
      </div>
      <div
        class="material-view__header__work-link"
        v-if="globalStore._userRole === 'teacher'"
      >
        <common-button @click="assignWorkStore.modalVisible = true">
          {{
            materialsStore.material.work
              ? 'Поменять работу'
              : 'Присвоить работу'
          }}
        </common-button>
      </div>
    </div>
    <div
      class="material-view__description"
      v-if="materialsStore.material.description"
    >
      <div v-html="materialsStore.material.description"></div>
    </div>
    <div
      v-else
      class="material-view__separator"
    ></div>
    <div class="material-view__content">
      <rich-text-container :content="materialsStore.material.content" />
    </div>
    <div
      class="material-view__files"
      v-if="materialsStore.material.files.length"
    >
      <file-list
        :files="materialsStore.material.files"
        label="Файлы курса"
      />
    </div>
  </div>
  <p
    class="no-material-selected"
    v-else
  >
    Выберите материал из дерева слева
  </p>
  <sure-modal
    v-model:visible="assignWorkStore.modalVisible"
    @confirm="assignWorkStore.assign()"
  >
    <template #title>
      <h3>Присвоить работу</h3>
    </template>
    <template #text>
      <div class="assign-work-to-material-modal">
        <p v-if="assignWorkStore.selectedWorkId.length">
          Сейчас присвоена:
          <router-link
            class="assign-work-to-material-modal__current-work-link"
            :to="`/create-work${materialsStore.material?.work?.slug}`"
          >
            {{ materialsStore.material?.work?.name }}
          </router-link>
        </p>
        <div class="assign-work-to-material-modal__search">
          <search-field v-model="assignWorkStore.search" />
        </div>
        <br />
        <div class="assign-work-to-material-modal__list">
          <check-list
            v-model="assignWorkStore.selectedWorkId"
            :items="assignWorkStore.works"
            item-label-key="name"
            item-key="id"
          />
        </div>
        <div class="assign-work-to-material-modal__deadline-toggle">
          <form-checkbox
            type="datetime-local"
            v-model="assignWorkStore.deadlinesAvailable"
            label="Установить дедлайны"
          />
        </div>
        <div
          class="assign-work-to-material-modal__deadlines"
          v-if="assignWorkStore.deadlinesAvailable"
        >
          <form-input
            v-if="assignWorkStore.solveDeadline"
            type="datetime-local"
            v-model="assignWorkStore.solveDeadline"
            label="Дедлайн решения"
          />
          <form-input
            v-if="assignWorkStore.checkDeadline"
            type="datetime-local"
            v-model="assignWorkStore.checkDeadline"
            label="Дедлайн проверки"
          />
        </div>
      </div>
    </template>
  </sure-modal>
</template>

<script setup lang="ts">
import { useMaterialsStore } from '../stores/materials'
import { useGlobalStore } from '@/store'
import { useAssignWorkToMaterialStore } from '../stores/assign-work'

const materialsStore = useMaterialsStore()
const assignWorkStore = useAssignWorkToMaterialStore()
const globalStore = useGlobalStore()
</script>

<style scoped lang="sass">
.material-view
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
