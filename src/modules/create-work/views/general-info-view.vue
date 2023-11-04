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
      <rich-text-area
        v-model="createWorkStore.work.description"
        label="Описание работы"
      />
    </div>
    <div class="form-group">
      <entity-select-widget
        label="Присвоить к теоретическому материалу (опционально)"
        v-model="createWorkStore.work.materialId"
        expect="id"
        nullable
      />
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
</style>
