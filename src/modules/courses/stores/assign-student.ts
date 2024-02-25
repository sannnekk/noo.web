import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import { useMaterialsStore } from './materials'
import type { User } from '@/core/data/entities/User'
import { Core } from '@/core/Core'

export const useAssignStudentsStore = defineStore(
  'assign-students-to-course',
  () => {
    const courseService = Core.Services.Course
    const userService = Core.Services.User
    const uiService = Core.Services.UI
    const materialsStore = useMaterialsStore()

    /**
     * Students list
     */
    const students = ref<User[]>([])

    /**
     * Student search query
     */
    const search = ref('')

    /**
     * Select student ids
     */
    const selectedStudentIds = ref(
      (materialsStore.course?.students || []).map((student) => student.id)
    )

    /**
     * Students count
     */
    const studentsCount = computed(
      () => (materialsStore.course?.students || []).length
    )

    /**
     * Assign student modal visibility
     */
    const modalVisible = ref(false)

    /**
     * Watch for course change and update selected student ids
     */
    watch(
      () => materialsStore.course,
      () => {
        selectedStudentIds.value = (materialsStore.course?.students || []).map(
          (student) => student.id
        )
      }
    )

    /**
     * Load students
     */
    watch(
      search,
      async () => {
        if (Core.Context.User?.role !== 'teacher') return

        try {
          const response = await userService.getStudents({
            search: search.value
          })
        } catch (error: any) {
          uiService.openErrorModal(
            'Произошла ошибка при загрузке студентов',
            error.message
          )
        }
      },
      { immediate: true }
    )

    /**
     * Submit students to course
     */
    async function save() {
      uiService.setLoading(true)

      try {
        await courseService.assignStudentsToCourse(
          materialsStore.course!.id,
          selectedStudentIds.value
        )

        uiService.openSuccessModal('Студенты успешно добавлены курс')
        modalVisible.value = false
      } catch (error: any) {
        uiService.openErrorModal(
          'Произошла ошибка при добавлении студентов к курсу',
          error.message
        )
      } finally {
        uiService.setLoading(false)
      }
    }

    return {
      students,
      search,
      save,
      modalVisible,
      selectedStudentIds,
      studentsCount
    }
  }
)
