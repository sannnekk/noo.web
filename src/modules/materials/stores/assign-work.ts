import { useGlobalStore } from '@/store'
import type { Work } from '@/types/entities/Work'
import { http } from '@/utils/http'
import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useMaterialsStore } from './materials'

export const useAssignWorkToMaterialStore = defineStore(
  'assign-work-to-material',
  () => {
    const globalStore = useGlobalStore()
    const materialsStore = useMaterialsStore()
    const route = useRoute()

    const works = ref<Work[]>([])
    const search = ref('')
    const materialSlug = computed(() => route.params.slug as string)
    const selectedWorkId = ref([
      materialsStore.getMaterialBySlug(materialSlug.value)?.work?.id
    ])

    const checkDeadline = ref<Date>(new Date())
    const solveDeadline = ref<Date>(new Date())

    watch(solveDeadline, () => {
      if (checkDeadline.value > solveDeadline.value) {
        checkDeadline.value.setDate(solveDeadline.value.getDate() + 2)
      }
    })

    const modalVisible = ref(false)

    watch(search, () => {
      if (search.value.length < 2) return

      http
        .get('/work', { search: search.value })
        .then((response) => {
          works.value = response
        })
        .catch(() => {
          globalStore.openModal('error', 'Ошибка при загрузке данных')
        })
    })

    function assign() {
      if (selectedWorkId.value.length !== 1) {
        return
      }

      globalStore.setLoading(true)

      http
        .patch(
          `/course/${materialSlug.value}/assign-work/${selectedWorkId.value[0]}`,
          {
            checkDeadline: checkDeadline.value,
            solveDeadline: solveDeadline.value
          }
        )
        .then(() =>
          globalStore.openModal('success', 'Работа успешно присвоена')
        )
        .catch(() =>
          globalStore.openModal('error', 'Ошибка при присвоении работы')
        )
        .finally(() => globalStore.setLoading(false))
    }

    return {
      works,
      search,
      assign,
      modalVisible,
      selectedWorkId,
      checkDeadline,
      solveDeadline
    }
  }
)
