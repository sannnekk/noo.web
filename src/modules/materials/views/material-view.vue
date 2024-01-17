<template>
  <div
    class="material-view"
    v-if="material"
  >
    <div class="material-view__header">
      <div class="material-view__header__title">
        <h1>{{ material.name }}</h1>
      </div>
      <div
        class="material-view__header__work-link"
        v-if="material.workId"
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
          {{ material.work ? 'Поменять работу' : 'Присвоить работу' }}
        </common-button>
      </div>
    </div>
    <div class="material-view__description">
      <div v-html="material.description"></div>
    </div>
    <div class="material-view__content">
      <rich-text-container :content="material.content" />
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
            :to="`/create-work${materialsStore.getMaterialBySlug($route.params.slug as string)?.work?.slug}`"
            >{{
              materialsStore.getMaterialBySlug($route.params.slug as string)
                ?.work?.name
            }}</router-link
          >
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
        <div class="assign-work-to-material-modal__deadlines">
          <form-input
            type="datetime-local"
            v-model="assignWorkStore.solveDeadline"
            label="Дедлайн решения"
          />
          <form-input
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
import { useRoute } from 'vue-router'
import { useMaterialsStore } from '../stores/materials'
import { computed } from 'vue'
import { useGlobalStore } from '@/store'
import { useAssignWorkToMaterialStore } from '../stores/assign-work'

const materialsStore = useMaterialsStore()
const assignWorkStore = useAssignWorkToMaterialStore()
const globalStore = useGlobalStore()
const route = useRoute()

const material = computed(() =>
  materialsStore.getMaterialBySlug(route.params.slug as string)
)
</script>

<style scoped lang="sass">
.material-view
  &__header
    width: 100%
    display: flex
    justify-content: space-between
    align-items: center

    &__title
      flex: 1

    &__work-link
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
