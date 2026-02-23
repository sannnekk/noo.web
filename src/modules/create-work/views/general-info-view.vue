<template>
  <div class="general-info-view">
    <div class="row">
      <div class="col-md-6">
        <div class="form-group">
          <form-input
            v-model="createWorkStore.work.name"
            label="Название работы"
            type="text"
          />
        </div>
      </div>
      <div class="col-md-3">
        <work-type-select
          label="Тип работы"
          v-model="createWorkStore.work.type"
        />
      </div>
      <div class="col-md-3">
        <subject-select
          label="Предмет"
          v-model="createWorkStore.work.subject"
        />
      </div>
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

  .form-group
    .beta-warning
      font-size: 0.8em
      margin-top: 0.5em

    &.checkbox
      padding: 1em 0

      &:deep()
        span
          color: var(--text-light)
</style>
