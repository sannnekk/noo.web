<template>
  <div class="index-view">
    <the-sidebar-layout>
      <template #sidebar>
        <settings-menu :nav-entries="settingsStore.navEntries" />
      </template>
      <template #content>
        <router-view />
      </template>
    </the-sidebar-layout>
  </div>
</template>

<script lang="ts" setup>
import settingsMenu from '../components/settings-menu.vue'
import { useSettingsStore } from '../stores/settings'

const settingsStore = useSettingsStore()
</script>
