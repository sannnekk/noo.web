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
import { useMaterialsStore } from '../stores/materials'

const assignWorkStore = useAssignWorkToMaterialStore()
const materialsStore = useMaterialsStore()
</script>
