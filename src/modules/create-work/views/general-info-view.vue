<template>
  <div class="general-info-view">
    <div class="form-group">
      <form-input
        v-model="createWorkStore.work.name"
        label="Название работы"
        type="text"
      />
    </div>
    <div class="form-group">
      <label class="general-info-view__work-description">
        Описание работы
      </label>
      <text-area v-model="createWorkStore.work.description" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCreateWorkStore } from '../stores/create-work'

const createWorkStore = useCreateWorkStore()
</script>

<style scoped lang="sass">
.general-info-view
  padding: 1rem
  padding-left: 0

  &__work-description
    font-size: 0.8em
    color: var(--text-light)
</style>
