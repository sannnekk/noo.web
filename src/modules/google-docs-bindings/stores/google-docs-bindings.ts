import { useSearch } from '@/composables/useSearch'
import { Core } from '@/core/Core'
import type { Pagination } from '@/core/data/Pagination'
import type { GoogleDocsBinding } from '@/core/data/entities/GoogleDocsBinding'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

export const useGoogleDocsBindingsStore = defineStore(
  'google-docs-bindings:google-docs-bindings',
  () => {
    const googleBindingService = Core.Services.GoogleDocsBinding
    const uiService = Core.Services.UI

    const router = useRouter()

    const createBindingForm = ref<
      Omit<GoogleDocsBinding, 'id' | 'createdAt' | 'updatedAt'>
    >(emptyBindingForm())

    function emptyBindingForm(): Omit<
      GoogleDocsBinding,
      'id' | 'createdAt' | 'updatedAt'
    > {
      return {
        name: '',
        entityName: '',
        entitySelector: {
          prop: '',
          value: ''
        },
        status: 'active',
        lastErrorText: null,
        frequency: 'daily',
        filePath: [],
        googleOAuthToken: '',
        googleCredentials: null as any,
        lastRunAt: null
      }
    }

    const bindingsSearch = useSearch(fetchBindings, { immediate: true })

    async function fetchBindings(pagination?: Pagination) {
      try {
        return await googleBindingService.getBindings(pagination)
      } catch (error: any) {
        uiService.openErrorModal('Ошибка при загрузке данных', error.message)
      }
    }

    async function onGoogleLogin(rawCredentials: any) {
      createBindingForm.value.googleOAuthToken = rawCredentials.code
      createBindingForm.value.googleCredentials = rawCredentials
    }

    async function saveBinding() {
      try {
        validateBindingForm(createBindingForm.value)

        await googleBindingService.createBinding(
          createBindingForm.value as GoogleDocsBinding,
          { showLoader: true }
        )
        createBindingForm.value = emptyBindingForm()
        uiService.openSuccessModal('Успешно сохранено', undefined, [
          {
            label: 'Назад к списку',
            design: 'primary',
            handler: () => {
              bindingsSearch.trigger()
              router.push('/google-docs-bindings')
            }
          }
        ])
      } catch (error: any) {
        uiService.openErrorModal('Ошибка при сохранении', error.message)
      }
    }

    function validateBindingForm(form: Partial<GoogleDocsBinding>) {
      if (!form) {
        throw new Error('Форма не заполнена')
      }

      if (!form.name) {
        throw new Error('Название не заполнено')
      }

      if (!form.entityName) {
        throw new Error('Выберите модуль для привязки')
      }

      if (
        !form.entitySelector ||
        !form.entitySelector?.prop ||
        !form.entitySelector?.value
      ) {
        throw new Error('Свойство селектора сущности не заполнено')
      }

      if (!form.googleOAuthToken || !form.googleCredentials) {
        throw new Error(
          'Перед отправкой необходимо авторизоваться через Google'
        )
      }
    }

    async function deleteBinding(id: GoogleDocsBinding['id']) {
      try {
        await googleBindingService.deleteBinding(id, { showLoader: true })
        uiService.openSuccessModal('Успешно удалено')
        bindingsSearch.trigger()
      } catch (error: any) {
        uiService.openErrorModal('Ошибка при удалении', error.message)
      }
    }

    async function triggerBinding(id: GoogleDocsBinding['id']) {
      try {
        await googleBindingService.trigger(id, { showLoader: true })
        uiService.openSuccessModal('Интеграция запущена')
        bindingsSearch.trigger()
      } catch (error: any) {
        uiService.openErrorModal('Ошибка при запуске задания', error.message)
      }
    }

    async function switchBindingOnOff(id: GoogleDocsBinding['id']) {
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
      createBindingForm,
      onGoogleLogin,
      saveBinding,
      deleteBinding,
      triggerBinding,
      switchBindingOnOff
    }
  }
)
