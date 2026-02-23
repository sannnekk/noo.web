import { useSearch } from '@/composables/useSearch'
import { Core } from '@/core/Core'
import type { Pagination } from '@/core/data/Pagination'
import type { GoogleSheetsBinding } from '@/core/data/entities/GoogleSheetsBinding'
import { defineStore } from 'pinia'

export const useGoogleSheetsBindingsStore = defineStore(
  'google-docs-bindings:google-docs-bindings',
  () => {
    const googleBindingService = Core.Services.GoogleSheetsBinding
    const uiService = Core.Services.UI

    const bindingsSearch = useSearch(fetchBindings, { immediate: true })

    async function fetchBindings(pagination?: Pagination) {
      try {
        return await googleBindingService.getBindings(pagination)
      } catch (error: any) {
        uiService.openErrorModal('Ошибка при загрузке данных', error.message)
      }
    }

    async function saveBinding(binding: GoogleSheetsBinding) {
      try {
        await googleBindingService.createBinding(binding, { showLoader: true })
        uiService.openSuccessModal('Успешно сохранено')
        bindingsSearch.trigger()
      } catch (error: any) {
        uiService.openErrorModal('Ошибка при сохранении', error.message)
      }
    }

    async function deleteBinding(id: GoogleSheetsBinding['id']) {
      try {
        await googleBindingService.deleteBinding(id, { showLoader: true })
        uiService.openSuccessModal('Успешно удалено')
        bindingsSearch.trigger()
      } catch (error: any) {
        uiService.openErrorModal('Ошибка при удалении', error.message)
      }
    }

    async function triggerBinding(id: GoogleSheetsBinding['id']) {
      try {
        await googleBindingService.trigger(id, { showLoader: true })
        uiService.openSuccessModal('Интеграция запущена')
        bindingsSearch.trigger()
      } catch (error: any) {
        uiService.openErrorModal('Ошибка при запуске задания', error.message)
      }
    }

    async function switchBindingOnOff(id: GoogleSheetsBinding['id']) {
      try {
        await googleBindingService.switchOnOff(id, { showLoader: true })
        uiService.openSuccessModal('Интеграция переключена')
        bindingsSearch.trigger()
      } catch (error: any) {
        uiService.openErrorModal('Ошибка при переключении', error.message)
      }
    }

    return {
      bindingsSearch,
      saveBinding,
      deleteBinding,
      triggerBinding,
      switchBindingOnOff
    }
  }
)
