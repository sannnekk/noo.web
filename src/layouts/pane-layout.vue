<template>
  <the-pane />
  <div
    class="pane-layout"
    :style="styles"
  >
    <div class="container">
      <div class="pane-layout__content">
        <div class="pane-layout__banners">
          <the-banner-container />
        </div>
        <div class="pane-layout__header">
          <the-header />
        </div>
        <div class="pane-layout__slot">
          <slot />
        </div>
        <div class="pane-layout__footer">
          <the-footer />
        </div>
      </div>
    </div>
  </div>
  <the-notifications-pane />
</template>

<script lang="ts" setup>
import { Core } from '@/core/Core'
import { ref } from 'vue'

const styles = ref<any>({})

Core.onInit((core) => {
  console.log('Core on init')
  const userSettingsService = core.Services.UserSettings
  const userSettingsStore = userSettingsService.Store()

  userSettingsService.reload().then(() => {
    console.log('User settings reloaded')
    styles.value.backgroundImage = userSettingsStore.backgroundImage
      ? `url(${core.Constants.MEDIA_URL}/${userSettingsStore.backgroundImage.src})`
      : ''
  })
})
</script>

<style lang="sass" scoped>
.pane-layout
  margin-bottom: 1em
  background-size: cover
  background-position: center
  background-repeat: no-repeat
  background-attachment: fixed

  &__slot
    background-color: var(--lightest)
    border-radius: var(--border-radius)
    min-height: 50vh
    margin-top: 1em
    box-shadow: 0px 0px 10px #00000011
</style>
