import type { FilterType } from '@/core/data/Pagination'

export interface SearchFilter {
  name: string
  type: FilterType['type']
  key: string

  // range
  rangeValues?: [any, any]
  rangeType?: 'date' | 'number'

  // tags

  // array
  arrayOptions?:
    | {
        label: string
        value: string
      }[]
    | (() => Promise<{ label: string; value: string }[]>)

  // boolean
  booleanLabels?: [string, string]
}
