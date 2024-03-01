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
  /**
   * 'as' is used to fix the issue with the type of the results
   * @issue https://github.com/vuejs/core/issues/2136
   */
  const pagination = ref<Pagination>(options.initialPagination || {})

  const results = ref<EntityType[]>([]) as Ref<EntityType[]>

  const resultsMeta = ref<ResponseMeta>({
    total: 0,
    relations: []
  })

  const isListLoading = ref(false)

  watch(pagination, () => (isListLoading.value = true), {
    immediate: options.immediate,
    deep: true
  })

  watch(
    pagination,
    debounce(async (_pagination: Pagination) => {
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

  return {
    pagination,
    results,
    resultsMeta,
    isListLoading
  }
}
