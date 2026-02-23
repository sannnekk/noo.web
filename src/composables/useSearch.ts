import type { Pagination } from '@/core/data/Pagination'
import type { ApiResponse, ResponseMeta } from '@/core/services/ApiService'
import { debounce } from '@/core/utils/debounce'
import { watch, type Ref, ref } from 'vue'

interface Options {
  initialPagination?: Pagination
  debounceTime?: number
  immediate?: boolean
}

export function useSearch<EntityType>(
  loadFunction: (
    pagination: Pagination
  ) => Promise<ApiResponse<EntityType[]> | undefined>,
  options: Options = {
    initialPagination: {
      search: '',
      page: 1,
      limit: 25,
      order: 'DESC',
      sort: 'id'
    },
    debounceTime: 250,
    immediate: true
  }
) {
  const pagination = ref<Pagination>(
    {
      ...options.initialPagination,
      search: options.initialPagination?.search || '',
      page: options.initialPagination?.page || 1,
      limit: options.initialPagination?.limit || 25
    } || {}
  )

  const results = ref<EntityType[]>([]) as Ref<EntityType[]>

  const resultsMeta = ref<ResponseMeta>({
    total: 0,
    relations: []
  })

  const isListLoading = ref(false)

  const prevSearch = ref(options.initialPagination?.search || '')

  watch(pagination, () => (isListLoading.value = true), {
    immediate: options.immediate,
    deep: true
  })

  watch(
    pagination,
    debounce(async (_pagination: Pagination) => {
      if (_pagination.search !== prevSearch.value) {
        _pagination.page = 1
        prevSearch.value = _pagination.search || ''
      }

      const response = await loadFunction(_pagination)

      isListLoading.value = false

      if (!response) {
        return
      }

      results.value = response.data
      resultsMeta.value = response.meta || { total: 0, relations: [] }
    }, options.debounceTime),
    {
      immediate: options.immediate,
      deep: true
    }
  )

  function trigger() {
    pagination.value = { ...pagination.value }
  }

  let triggered = false

  function triggerOnce() {
    if (!triggered) {
      trigger()
      triggered = true
    }
  }

  return {
    pagination,
    results,
    resultsMeta,
    isListLoading,
    trigger,
    triggerOnce
  }
}
