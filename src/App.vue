<template>
  <div
    class="app"
    v-if="Core.isInitialized()"
  >
    <component :is="layout">
      <router-view />
    </component>
    <div>
      <the-loader-overlay
        v-if="Core.Services.UI.Store().isLoading"
        :loading-progress="Core.Services.UI.Store().loadingProgress"
      />
      <base-modal
        :title="Core.Services.UI.Store().globalModal.title"
        :message="Core.Services.UI.Store().globalModal.message"
        :type="Core.Services.UI.Store().globalModal.type"
        :actions="Core.Services.UI.Store().globalModal.actions"
        v-model:visible="Core.Services.UI.Store().globalModal.isOpen"
      />
      <retry-login-modal
        v-if="Core.Services.UI.Store().retryLoginModal.isOpen"
        v-model="Core.Services.UI.Store().retryLoginModal"
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
