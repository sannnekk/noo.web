<template>
  <div class="index-materials-view">
    <div class="index-materials-view__tree">
      <router-link
        class="index-materials-view__tree__back-button"
        to="/materials"
      >
        &#8249; Ко всем курсам
      </router-link>
      <h2 class="index-materials-view__tree__title">Содержание</h2>
      <materials-tree :data="materialsStore.getMaterialsTree()" />
    </div>
    <div class="index-materials-view__content">
      <router-view />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useMaterialsStore } from '../stores/materials'
import MaterialsTree from '../components/materials-tree.vue'
import { useRoute } from 'vue-router'

const materialsStore = useMaterialsStore()

const route = useRoute()
</script>

<style lang="sass" scoped>
.index-materials-view
  display: flex
  flex-direction: row

  &__tree
    width: 300px
    padding: 1rem
    margin: 1rem
    border-radius: var(--border-radius)
    border: 1px solid var(--border-color)

    &__back-button
      display: block
      margin-bottom: 1rem
      font-size: 0.8em
      color: var(--text-light)
      text-decoration: none

      &:hover
        color: var(--secondary)

    &__title
      margin: 0 0 1rem 0
      font-size: 1.3rem
      font-weight: bold

  &__content
    flex: 1
    padding: 1rem
</style>
