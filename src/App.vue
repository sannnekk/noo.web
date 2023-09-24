<template>
  <div class="app">
    <component :is="layout">
      <router-view />
    </component>
    <the-loader-overlay v-if="globalStore._isLoading" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useGlobalStore } from '@/store'
import paneLayout from './layouts/pane-layout.vue'

const globalStore = useGlobalStore()

const layout = computed(() => {
  return useRoute()?.meta?.layout || paneLayout
})
</script>

<style scoped></style>
