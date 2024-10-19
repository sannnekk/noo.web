<template>
  <div class="personalization-view">
    <settings-section>
      <template #title>Смена фона <beta-tag /></template>
      <template #content>
        <change-background-form />
      </template>
    </settings-section>
    <settings-section>
      <template #title>Размер шрифта</template>
      <template #content>
        <feature-block version="3.3" />
      </template>
    </settings-section>
  </div>
</template>

<script lang="ts" setup>
import { Core } from '@/core/Core'
import ChangeBackgroundForm from '../components/personalization/change-background-form.vue'
import SettingsSection from '../components/settings-section.vue'

const userSettingsService = Core.Services.UserSettings

userSettingsService.reload()
</script>

<style lang="sass" scoped></style>
