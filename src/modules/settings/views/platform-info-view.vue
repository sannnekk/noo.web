<template>
  <div
    class="platform-info-view"
    v-if="!platformStore.moduleLoading"
  >
    <settings-section>
      <template #title> Текущая версия </template>
      <template #content>
        <p>
          {{ platformStore.version }}
        </p>
      </template>
    </settings-section>
    <settings-section v-if="Core.Context.roleIs(['teacher', 'admin'])">
      <template #title> Changelog </template>
      <template #content>
        <changelog-view :changelog="platformStore.changelog" />
      </template>
    </settings-section>
  </div>
  <div
    class="platform-info-view__loading"
    v-else
  >
    <loader-icon contrast />
  </div>
</template>

<script setup lang="ts">
import { Core } from '@/core/Core'
import ChangelogView from '../components/platform-info/changelog-view.vue'
import SettingsSection from '../components/settings-section.vue'
import { usePlatformInfoStore } from '../stores/platform-info'

const platformStore = usePlatformInfoStore()

platformStore.fetchVersion()

if (Core.Context.roleIs(['teacher', 'admin'])) {
  platformStore.fetchChangelog()
}
</script>

<style lang="sass" scoped>
.platform-info-view
  &__loading
    display: flex
    justify-content: center
    align-items: center
    height: 500px
    font-size: 3em
</style>
