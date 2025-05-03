import { type ShallowRef, shallowRef, ref } from 'vue'
import type { ApiError, ApiResponse } from '../api/api.utils'
import { Pagination, type IPagination } from '../utils/pagination.utils'
import { debouncedWatch } from '@vueuse/core'

interface UseSearchOptions {
  /**
   * If true, the search will be executed immediately after the comsable is used.
   * @default true
   */
  immediate?: boolean
  /**
   * Debounce time in milliseconds
   * @default 500
   */
  debounce?: number
  /**
   * Initial filters. These filters will be used by search every time and cannot be overriden
   * @default undefined
   */
  initialFilters?: IPagination['filters']
}

interface UseSearchReturn<T> {
  data: ShallowRef<T[]>
  search: ShallowRef<string>
  page: ShallowRef<number>
  pageSize: ShallowRef<number>
  sort: ShallowRef<string | undefined>
  sortDirection: ShallowRef<'asc' | 'desc' | undefined>
  total: ShallowRef<number>
  error: ShallowRef<ApiError | null>
  filters: ShallowRef<IPagination['filters']>
  isLoading: ShallowRef<boolean>
  reload: () => Promise<void>
}

function useSearch<T>(
  searchFunction: (pagination?: IPagination) => Promise<ApiResponse<T[]>>,
  options: UseSearchOptions = {}
): UseSearchReturn<T> {
  const { immediate = true, debounce = 500, initialFilters } = options

  const data = shallowRef<T[]>([])
  const search = shallowRef<string>('')
  const page = shallowRef<number>(1)
  const pageSize = shallowRef<number>(25)
  const total = shallowRef<number>(0)
  const filters = ref<IPagination['filters']>()
  const sort = shallowRef<string>()
  const sortDirection = shallowRef<'asc' | 'desc'>('desc')
  const isLoading = shallowRef<boolean>(false)
  const error = shallowRef<ApiError | null>(null)

  async function fetchData() {
    isLoading.value = true

    const pagination = new Pagination(
      page.value,
      pageSize.value,
      sort.value,
      sortDirection.value,
      combineFilters(filters.value, initialFilters),
      search.value
    )

    try {
      const response = await searchFunction(pagination)

      data.value = response.data
      error.value = response.error || null
      total.value = response.metadata?.total || 0
    } finally {
      isLoading.value = false
    }
  }

  function combineFilters(
    filters: IPagination['filters'] | undefined,
    initialFilters: IPagination['filters'] | undefined
  ): IPagination['filters'] {
    if (!filters && !initialFilters) return []

    const combinedFilters = [...(filters || []), ...(initialFilters || [])]

    return combinedFilters.filter((filter, index, self) => {
      return (
        index ===
        self.findIndex((f) => f.getQueryKey() === filter.getQueryKey())
      )
    })
  }

  debouncedWatch([search, page, pageSize, filters], fetchData, {
    immediate,
    debounce
  })

  return {
    data,
    search,
    page,
    pageSize,
    total,
    filters,
    isLoading,
    error,
    sort,
    sortDirection,
    reload: fetchData
  }
}

export { useSearch, type UseSearchReturn, type UseSearchOptions }
