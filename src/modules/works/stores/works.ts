import { defineStore } from 'pinia'
import { ref, reactive, watch } from 'vue'
import { useGlobalStore } from '@/store'
import { http } from '@/utils/http'
import type { Work } from '@/types/entities/Work'

export const useWorksStore = defineStore('works', () => {
  const _globalStore = useGlobalStore()

  const works = reactive<Work[]>([])
  const search = ref('')

  watch(
    search,
    () => {
      http
        .get('/work', { search: search.value })
        .then((response) => {
          works.splice(0, works.length)
          works.push(...response)
        })
        .catch(() => {
          _globalStore.openModal('error', 'Не удалось загрузить работы')
        })
    },
    { immediate: true }
  )

  return {
    works,
    search
  }
})
