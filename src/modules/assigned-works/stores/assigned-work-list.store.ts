import { useSearch } from '@/core/composables/useSearch'
import { defineStore } from 'pinia'
import { AssignedWorkService } from '../api/assigned-work.service'
import { shallowRef, type ShallowRef } from 'vue'
import type { AssignedWorkListTab } from '../types'
import { EnumFilter } from '@/core/utils/pagination.utils'
import type { CheckStatus, SolveStatus } from '../api/assigned-work.types'

interface AssignedWorkListStore {
  tabId: ShallowRef<AssignedWorkListTab>
  setUserId: (id: string | undefined) => void
  setTabId: (id: AssignedWorkListTab) => void
  allSearch: ReturnType<typeof useSearch>
  notMadeSearch: ReturnType<typeof useSearch>
  notCheckedSearch: ReturnType<typeof useSearch>
  checkedSearch: ReturnType<typeof useSearch>
}

const useAssignedWorkListStore = defineStore(
  'assigned-works:assigned-work-list',
  (): AssignedWorkListStore => {
    const userId = shallowRef<string>()
    const tabId = shallowRef<AssignedWorkListTab>('all')

    const allSearch = useSearch(
      (pagination) => AssignedWorkService.get(pagination, userId.value),
      { immediate: false }
    )

    const notMadeSearch = useSearch(
      (pagination) => AssignedWorkService.get(pagination, userId.value),
      {
        immediate: false,
        initialFilters: [
          new EnumFilter<SolveStatus>('checkStatus', 'not-solved')
        ]
      }
    )

    const notCheckedSearch = useSearch(
      (pagination) => AssignedWorkService.get(pagination, userId.value),
      {
        immediate: false,
        initialFilters: [
          new EnumFilter<SolveStatus>('solveStatus', 'solved'),
          new EnumFilter<CheckStatus>('checkStatus', 'not-checked')
        ]
      }
    )

    const checkedSearch = useSearch(
      (pagination) => AssignedWorkService.get(pagination, userId.value),
      {
        immediate: false,
        initialFilters: [new EnumFilter<CheckStatus>('checkStatus', 'checked')]
      }
    )

    function setUserId(id: string | undefined) {
      userId.value = id
    }

    function setTabId(id: AssignedWorkListTab) {
      tabId.value = id
    }

    return {
      tabId,
      setUserId,
      setTabId,
      allSearch,
      notMadeSearch,
      notCheckedSearch,
      checkedSearch
    }
  }
)

export { useAssignedWorkListStore }
