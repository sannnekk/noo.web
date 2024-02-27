<template>
  <div
    class="app"
    v-if="Core.isInitialized()"
  >
    <component :is="layout">
      <router-view :key="$route.path.split('/')[1]" />
    </component>
    <div>
      <the-loader-overlay v-if="Core.Services.UI.Store().isLoading" />
      <base-modal
        :title="Core.Services.UI.Store().globalModal.title"
        :message="Core.Services.UI.Store().globalModal.message"
        :type="Core.Services.UI.Store().globalModal.type"
        v-model:visible="Core.Services.UI.Store().globalModal.isOpen"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeMount } from 'vue'
import { useRoute } from 'vue-router'
import paneLayout from './layouts/pane-layout.vue'
import { Core } from './core/Core'

onBeforeMount(() => {
  Core.init()
})

const layout = computed(() => {
  return useRoute()?.meta?.layout || paneLayout
})
</script>

<style scoped></style>
