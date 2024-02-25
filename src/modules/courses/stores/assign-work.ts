import type { Work } from '@/core/data/entities/Work'
import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useMaterialsStore } from './materials'
import { Core } from '@/core/Core'

export const useAssignWorkToMaterialStore = defineStore(
  'assign-work-to-material',
  () => {
    const uiService = Core.Services.UI
    const workService = Core.Services.Work
    const courseService = Core.Services.Course

    const materialsStore = useMaterialsStore()
    const route = useRoute()

    /**
     * Works list to assign to material
     */
    const works = ref<Work[]>([])

    /**
     * Work search query
     */
    const search = ref('')

    /**
     * Current aterial slug
     */
    const materialSlug = computed(() => route.params.slug as string)

    /**
     * Selected work id
     * TODO: make it single value instead of array
     */
    const selectedWorkId = ref([
      materialsStore.getMaterialBySlug(materialSlug.value)?.work?.id
    ])

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
    watch(search, async () => {
      if (search.value.length < 2) return

      try {
        const response = await workService.getWorks({
          search: search.value
        })

        works.value = response.data
      } catch (error: any) {
        uiService.openErrorModal(
          'Произошла ошибка при загрузке работ',
          error.message
        )
      }
    })

    /**
     * Submit work to material
     */
    async function assign() {
      if (selectedWorkId.value.length !== 1 || !selectedWorkId.value[0]) {
        uiService.openWarningModal('Выберите одну работу для добавления')
        return
      }

      uiService.setLoading(true)

      try {
        await courseService.assignWorkToMaterial(
          materialSlug.value,
          selectedWorkId.value[0],
          {
            checkDeadline: checkDeadline.value,
            solveDeadline: solveDeadline.value
          }
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
      works,
      search,
      assign,
      modalVisible,
      selectedWorkId,
      checkDeadline,
      solveDeadline,
      deadlinesAvailable
    }
  }
)
