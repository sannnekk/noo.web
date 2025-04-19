import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { UserSettings } from '@/core/data/entities/UserSettings'

/**
 * Installs Notifications store
 */
export function installUserSettingsStore() {
  return defineStore('user-settings', () => {
    /**
     * Main user settings object from the server
     */
    const userSettings = ref<UserSettings>()

    /**
     * Background image object
     */
    const backgroundImage = computed(() => userSettings.value?.backgroundImage)

    /**
     * Font size
     */
    const fontSize = computed(() => userSettings.value?.fontSize)

    return {
      userSettings,
      backgroundImage,
      fontSize
    }
  })
}
