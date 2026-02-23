import { Core } from '@/core/Core'
import type { Subject } from '@/core/data/entities/Subject'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSubjectsStore = defineStore('settings-module:subjects', () => {
  const subjectService = Core.Services.Subject
  const uiService = Core.Services.UI

  const subjects = ref<Subject[]>([])

  const moduleLoading = ref(false)

  async function fetchSubjects() {
    moduleLoading.value = true

    try {
      const result = await subjectService.getSubjects()
      subjects.value = result.data
      moduleLoading.value = false
    } catch (error: any) {
      uiService.openErrorModal(
        'Ошибка при загрузке списка предметов',
        error.message
      )
    }
  }

  async function createSubject(subject: Omit<Subject, 'id'>) {
    try {
      await subjectService.createSubject(subject, {
        showLoader: true
      })

      uiService.openSuccessModal('Предмет успешно создан')
      await fetchSubjects()
    } catch (error: any) {
      uiService.openErrorModal('Ошибка при создании предмета', error.message)
    }
  }

  async function updateSubject(subject: Subject) {
    try {
      await subjectService.updateSubject(subject.id, subject, {
        showLoader: true
      })

      uiService.openSuccessModal('Предмет успешно обновлен')
      await fetchSubjects()
    } catch (error: any) {
      uiService.openErrorModal('Ошибка при обновлении предмета', error.message)
    }
  }

  async function deleteSubject(subject: Subject) {
    try {
      await subjectService.deleteSubject(subject.id, {
        showLoader: true
      })

      uiService.openSuccessModal('Предмет успешно удален')
      await fetchSubjects()
    } catch (error: any) {
      uiService.openErrorModal('Ошибка при удалении предмета', error.message)
    }
  }

  return {
    moduleLoading,
    subjects,
    fetchSubjects,
    createSubject,
    updateSubject,
    deleteSubject
  }
})
