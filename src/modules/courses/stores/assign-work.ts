import type { Work } from '@/core/data/entities/Work'
import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useCourseStore } from './course'
import { Core } from '@/core/Core'
import type { Pagination } from '@/core/data/Pagination'
import { useSearch } from '@/composables/useSearch'
import Date from '@/core/utils/date'

export const useAssignWorkToMaterialStore = defineStore(
  'courses-module:assign-work',
  () => {
    const uiService = Core.Services.UI
    const workService = Core.Services.Work
    const courseService = Core.Services.Course

    const courseStore = useCourseStore()
    const route = useRoute()

    /**
     * search
     */
    const { pagination, results, resultsMeta, isListLoading } =
      useSearch<Work>(fetchWorks)

    /**
     * Current material slug
     */
    const materialSlug = computed(() => route.params.slug as string)

    /**
     * Selected work id
     * TODO: make it single value instead of array
     */
    const selectedWorkId = ref([
      courseStore.getMaterialBySlug(materialSlug.value)?.workId
    ])

    /**
     * Check deadline
     */
    const checkDeadline = ref<Date | undefined>(Date.inDays(3))

    /**
     * Solve deadline
     */
    const solveDeadline = ref<Date | undefined>(Date.inDays(0))

    /**
     * Deadlines visibility
     */
    const deadlinesAvailable = ref(false)

    watch(
      materialSlug,
      () => {
        if (Core.Context.roleIs(['admin', 'student', 'mentor', 'assistant'])) {
          return
        }

        const material = courseStore.getMaterialBySlug(materialSlug.value)

        if (!material) {
          return
        }

        selectedWorkId.value = [material.workId]
        checkDeadline.value = material.workCheckDeadline || Date.inDays(3)
        solveDeadline.value = material.workSolveDeadline || Date.inDays(0)

        deadlinesAvailable.value =
          !!material.workCheckDeadline || !!material.workSolveDeadline
      },
      { immediate: true }
    )

    /**
     * Current modal visibility
     */
    const modalVisible = ref(false)
    const unassignModalVisible = ref(false)

    /**
     * Watch for search query and load works
     */
    async function fetchWorks(pagination: Pagination) {
      if (Core.Context.roleIs(['admin', 'student', 'mentor', 'assistant'])) {
        return
      }

      try {
        return await workService.getWorks(pagination)
      } catch (error: any) {
        uiService.openErrorModal(
          'Произошла ошибка при загрузке работ',
          error.message
        )
      }
    }

    /**
     * Submit work to material
     */
    async function assign() {
      if (Core.Context.roleIs(['student', 'mentor', 'assistant'])) {
        return
      }

      if (selectedWorkId.value.length !== 1 || !selectedWorkId.value[0]) {
        uiService.openWarningModal('Выберите одну работу для добавления')
        return
      }

      try {
        await courseService.assignWorkToMaterial(
          materialSlug.value,
          selectedWorkId.value[0],
          deadlinesAvailable.value
            ? {
                checkDeadline: checkDeadline.value,
                solveDeadline: solveDeadline.value
              }
            : {},
          { showLoader: true }
        )

        uiService.openSuccessModal('Работа успешно добавлена к материалу')
        modalVisible.value = false

        await courseStore.fetchCourse()
      } catch (error: any) {
        uiService.openErrorModal(
          'Произошла ошибка при добавлении работы к материалу',
          error.message
        )
      }
    }

    /**
     * Unassign work from material
     */
    async function unassign() {
      if (Core.Context.roleIs(['student', 'mentor', 'assistant'])) {
        return
      }

      if (!courseStore.getMaterialBySlug(materialSlug.value)?.workId) {
        uiService.openWarningModal('Материал не содержит работы')
        return
      }

      try {
        await courseService.unassignWorkFromMaterial(materialSlug.value, {
          showLoader: true
        })

        uiService.openSuccessModal('Работа успешно удалена из материала')
        unassignModalVisible.value = false

        if (courseStore.material) {
          courseStore.material.work = undefined
          courseStore.material.workId = undefined
          courseStore.material.workCheckDeadline = null
          courseStore.material.workSolveDeadline = null
        }
      } catch (error: any) {
        uiService.openErrorModal(
          'Произошла ошибка при удалении работы из материала',
          error.message
        )
      }
    }

    return {
      pagination,
      results,
      resultsMeta,
      isListLoading,
      assign,
      unassign,
      modalVisible,
      unassignModalVisible,
      selectedWorkId,
      checkDeadline,
      solveDeadline,
      deadlinesAvailable
    }
  }
)
