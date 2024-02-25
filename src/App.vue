<template>
  <div
    class="app"
    v-auto-animate
  >
    <component :is="layout">
      <router-view />
    </component>
    <div v-if="initialized && _core">
      <the-loader-overlay v-if="_core.Services.UI.Store().isLoading" />
      <base-modal
        :title="_core.Services.UI.Store().globalModal.title"
        :message="_core.Services.UI.Store().globalModal.message"
        :type="_core.Services.UI.Store().globalModal.type"
        v-model:visible="_core.Services.UI.Store().globalModal.isOpen"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import paneLayout from './layouts/pane-layout.vue'
import { Core } from './core/Core'

const _core = ref<typeof Core | null>(null)
const initialized = ref(false)

onMounted(() => {
  console.log('App mounted')
  _core.value = Core.init()
  initialized.value = true
})

const layout = computed(() => {
  if (!initialized.value) return 'div'

  return useRoute()?.meta?.layout || paneLayout
})
</script>

<style scoped></style>
