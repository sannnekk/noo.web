import { defineStore } from 'pinia'
import { ref, reactive, watch } from 'vue'
import { useGlobalStore } from '@/store'
import { http } from '@/utils/http'
import type { Work } from '@/types/entities/Work'

export const useWorksStore = defineStore('works', () => {
  const _globalStore = useGlobalStore()

  const works = reactive<Work[]>([])
  const search = ref('')
  const listLoading = ref(false)

  watch(
    search,
    () => {
      listLoading.value = true
      http
        .get('/work', { search: search.value })
        .then((response) => {
          works.splice(0, works.length)
          works.push(...response)
        })
        .catch((e) => {
          _globalStore.openModal('error', 'Не удалось загрузить работы')
        })
        .finally(() => {
          listLoading.value = false
        })
    },
    { immediate: true }
  )

  return {
    works,
    search,
    listLoading
  }
})
