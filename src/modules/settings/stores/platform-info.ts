import { Core } from '@/core/Core'
import { type ChangelogItem } from '@/core/data/system/Changelog'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const usePlatformInfoStore = defineStore(
  'settings-module:platform-info',
  () => {
    const platformService = Core.Services.Platform
    const uiService = Core.Services.UI

    const version = ref<string | null>(null)
    const changelog = ref<ChangelogItem[]>([])
    const moduleLoading = ref(false)

    async function fetchVersion() {
      moduleLoading.value = true
      version.value = null
      try {
        const reuslt = await platformService.getVersion()
        version.value = reuslt.data
      } catch (error: any) {
        uiService.openErrorModal(
          'Не удалось получить версию платформы',
          error.message
        )
      } finally {
        moduleLoading.value = false
      }
    }

    async function fetchChangelog() {
      moduleLoading.value = true

      changelog.value = []

      try {
        const result = await platformService.getChangelog()
        changelog.value = result.data
      } catch (error: any) {
        uiService.openErrorModal('Не удалось получить changelog', error.message)
      } finally {
        moduleLoading.value
      }
    }

    return {
      version,
      fetchVersion,
      changelog,
      fetchChangelog,
      moduleLoading
    }
  }
)
