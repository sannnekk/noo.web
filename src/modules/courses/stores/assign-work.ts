import type { Work } from '@/core/data/entities/Work'
import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useCourseStore } from './course'
import { Core } from '@/core/Core'
import type { Pagination } from '@/core/data/Pagination'
import { useSearch } from '@/composables/useSearch'

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

    watch(
      materialSlug,
      () => {
        if (Core.Context.User?.role !== 'teacher') {
          return
        }

        const material = courseStore.getMaterialBySlug(materialSlug.value)

        if (!material) {
          return
        }

        selectedWorkId.value = [material.workId]
        checkDeadline.value = material.workCheckDeadline
        solveDeadline.value = material.workSolveDeadline

        deadlinesAvailable.value =
          !!material.workCheckDeadline || !!material.workSolveDeadline
      },
      { immediate: true }
    )

    /**
     * Check deadline
     */
    const checkDeadline = ref<Date | undefined>(new Date())

    /**
     * Solve deadline
     */
    const solveDeadline = ref<Date | undefined>(new Date())

    /**
     * Deadlines visibility
     */
    const deadlinesAvailable = ref(false)

    /**
     * Current modal visibility
     */
    const modalVisible = ref(false)

    /**
     * Watch for search query and load works
     */
    async function fetchWorks(pagination: Pagination) {
      if (Core.Context.User?.role !== 'teacher') {
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
      if (Core.Context.User?.role !== 'teacher') {
        return
      }

      if (selectedWorkId.value.length !== 1 || !selectedWorkId.value[0]) {
        uiService.openWarningModal('Выберите одну работу для добавления')
        return
      }

      uiService.setLoading(true)

      try {
        await courseService.assignWorkToMaterial(
          materialSlug.value,
          selectedWorkId.value[0],
          deadlinesAvailable.value
            ? {
                checkDeadline: checkDeadline.value,
                solveDeadline: solveDeadline.value
              }
            : {}
        )

        uiService.openSuccessModal('Работа успешно добавлена к материалу')
        modalVisible.value = false
      } catch (error: any) {
        uiService.openErrorModal(
          'Произошла ошибка при добавлении работы к материалу',
          error.message
        )
      } finally {
        uiService.setLoading(false)
      }
    }

    return {
      pagination,
      results,
      resultsMeta,
      isListLoading,
      assign,
      modalVisible,
      selectedWorkId,
      checkDeadline,
      solveDeadline,
      deadlinesAvailable
    }
  }
)
