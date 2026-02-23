import { Core } from '@/core/Core'
import type { UserSettings } from '@/core/data/entities/UserSettings'
import { entityFactory } from '@/core/utils/entityFactory'
import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const usePersonalizationStore = defineStore(
  'settings-module:personalization',
  () => {
    const uiService = Core.Services.UI
    const userSettingsService = Core.Services.UserSettings
    const userSettingsStore = userSettingsService.Store()

    const moduleLoading = ref(false)

    const settings = ref<UserSettings>()

    watch(
      () => userSettingsStore.userSettings,
      (value) => {
        settings.value = value || defaultSettings()
      },
      { immediate: true, deep: true }
    )

    async function changeSettings() {
      if (!settings.value) {
        return
      }

      moduleLoading.value = true

      try {
        await userSettingsService.update(settings.value)
      } catch (error: any) {
        uiService.openErrorModal('Ошибка при загрузке сниппетов', error.message)
      } finally {
        moduleLoading.value = false
      }
    }

    function defaultSettings(): UserSettings {
      return entityFactory<UserSettings>('user-settings')
    }

    return {
      moduleLoading,
      settings,
      changeSettings
    }
  }
)
