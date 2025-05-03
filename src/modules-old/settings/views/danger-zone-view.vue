<template>
  <div class="danger-zone-view">
    <div class="danger-zone-view__disclaimer">
      <danger-block>
        <h3>Опасная зона</h3>
        <p>
          В этом разделе вы можете управлять процессами, которые могут повлиять
          на работу платформы.
        </p>
      </danger-block>
    </div>
    <settings-section>
      <template #title>Процессы</template>
      <template #content> 000 </template>
    </settings-section>
  </div>
</template>

<script lang="ts" setup>
import SettingsSection from '../components/settings-section.vue'
</script>

<style lang="sass" scoped>
.danger-zone-view
  &__disclaimer
    h3
      margin: 0

    p
      margin: 0
</style>
