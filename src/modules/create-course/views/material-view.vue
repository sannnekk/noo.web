<template>
  <div
    class="material-view"
    v-if="createCourseStore.currentMaterial"
  >
    <div class="form-group">
      <form-input
        type="text"
        v-model="createCourseStore.currentMaterial.name"
        label="Название материала"
      />
    </div>
    <div class="form-group">
      <label class="material-view__label">Описание</label>
      <text-area v-model="createCourseStore.currentMaterial.description" />
    </div>
    <div class="form-group">
      <label class="material-view__label">Содержание:</label>
      <rich-text-area v-model="createCourseStore.currentMaterial.content" />
    </div>
    <br />
    <div class="form-group">
      <common-button
        alignment="right"
        design="secondary"
        @click="createCourseStore.addMaterial()"
      >
        Добавить материал
      </common-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useCreateCourseStore } from '../stores/create-course'
import { ref } from 'vue'

const createCourseStore = useCreateCourseStore()
</script>

<style scoped lang="sass">
.material-view
  &__label
    display: block
    margin-top: 0.5rem
    color: var(--text-light)
    font-size: 0.8em
</style>
