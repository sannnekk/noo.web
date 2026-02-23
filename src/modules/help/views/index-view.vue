<template>
  <div class="index-view">
    <the-sidebar-layout>
      <template #sidebar>
        <aside class="index-view__sidebar">
          <div class="index-view__sidebar__header">
            <h3>Категории</h3>
          </div>
          <div class="index-view__sidebar__categories">
            <faq-category-tree :categories="helpStore.categories" />
          </div>
        </aside>
      </template>
      <template #content>
        <router-view :key="$route.fullPath" />
      </template>
    </the-sidebar-layout>
  </div>
</template>

<script lang="ts" setup>
import faqCategoryTree from '../components/faq-category-tree.vue'
import { useHelpStore } from '../stores/help'

const helpStore = useHelpStore()

helpStore.fetchCategoryTree()
</script>
