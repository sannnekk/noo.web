<template>
  <sure-modal
    v-model:visible="assignWorkStore.modalVisible"
    @confirm="assignWorkStore.assign()"
  >
    <template #title>
      <h3>Присвоить работу</h3>
    </template>
    <template #text>
      <div
        class="assign-work-to-material-modal"
        v-auto-animate
      >
        <p v-if="assignWorkStore.selectedWorkId.length">
          Сейчас присвоена:
          <router-link
            class="assign-work-to-material-modal__current-work-link"
            :to="`/create-work${courseStore.material?.work?.slug}`"
          >
            {{ courseStore.material?.work?.name }}
          </router-link>
        </p>
        <div class="assign-work-to-material-modal__search">
          <search-field
            v-model="assignWorkStore.pagination.search"
            :is-loading="assignWorkStore.isListLoading"
          />
        </div>
        <br />
        <div class="assign-work-to-material-modal__list">
          <check-list
            v-model="assignWorkStore.selectedWorkId"
            :items="assignWorkStore.results"
            item-label-key="subject.name,name"
            item-key="id"
          />
          <list-pagination
            v-if="
              assignWorkStore.pagination.page &&
              assignWorkStore.pagination.limit
            "
            v-model:page="assignWorkStore.pagination.page"
            :limit="assignWorkStore.pagination.limit"
            :total="assignWorkStore.resultsMeta.total"
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
            type="date"
            v-model="assignWorkStore.solveDeadline"
            label="Дедлайн решения"
          />
          <form-input
            type="date"
            v-model="assignWorkStore.checkDeadline"
            label="Дедлайн проверки"
          />
        </div>
        <br />
        <warning-block v-if="assignWorkStore.deadlinesAvailable">
          Время и дата указываются в МСК
        </warning-block>
      </div>
    </template>
  </sure-modal>
</template>

<script setup lang="ts">
import { useAssignWorkToMaterialStore } from '../stores/assign-work'
import { useCourseStore } from '../stores/course'

const assignWorkStore = useAssignWorkToMaterialStore()
const courseStore = useCourseStore()
</script>

<style lang="sass" scoped>
.assign-work-to-material-modal
  &__current-work-link
    color: var(--lila)
    text-decoration: underline
</style>
