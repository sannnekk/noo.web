import { useGlobalStore } from '@/store'
import type { AssignedWork } from '@/types/entities/AssignedWork'
import { http } from '@/utils/http'
import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'

export const useTransferWorkStore = defineStore('transfer-work', () => {
  const _globalStore = useGlobalStore()
  const _route = useRoute()

  const search = ref('')

  const mentors = ref([])
  const work = ref<AssignedWork>()

  const selectedMentorId = ref('')

  watch(
    () => _route.params.workId,
    () => {
      _globalStore.setLoading(true)
      http
        .get(`/assigned-work/${_route.params.workId}`)
        .then((data) => (work.value = data))
        .catch(() =>
          _globalStore.openModal('error', 'Ошибка при загрузке работы')
        )
        .finally(() => _globalStore.setLoading(false))
    },
    { immediate: true }
  )

  watch(
    search,
    () => {
      http
        .get('/user/mentor/search', { search: search.value })
        .then((data) => (mentors.value = data))
        .catch((e) => {
          _globalStore.openModal('error', 'Ошибка при поиске ментора')
        })
    },
    { immediate: true }
  )

  function transfer() {
    _globalStore.setLoading(true)
    http
      .patch(
        `/assigned-work/${_route.params.workId}/transfer/${selectedMentorId.value}`
      )
      .then(() => {
        _globalStore.openModal(
          'success',
          'Работа успешно передана другому ментору'
        )
      })
      .catch(() =>
        _globalStore.openModal('error', 'Ошибка при передаче работы')
      )
      .finally(() => _globalStore.setLoading(false))
  }

  return { search, mentors, selectedMentorId, transfer, work }
})
