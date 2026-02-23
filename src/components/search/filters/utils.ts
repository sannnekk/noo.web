import type { FilterType } from '@/core/data/Pagination'
import type { SearchFilter } from './SearchFilter'

export function emptyFilter(filter: SearchFilter): FilterType {
  let value: FilterType['value']

  switch (filter.type) {
    case 'arr':
      value = []
      break
    case 'range':
      switch (filter.rangeType) {
        case 'date':
          value = [dateOneMonthAgo(), new Date()]
          break
        case 'number':
          value = [0, 100]
          break
        default:
          value = [null, null] as any
          break
      }
      break
    case 'boolean':
      value = false
      break
    case 'string':
      value = ''
      break
    case 'number':
      value = 0
      break
    case 'tags':
      value = []
      break
    case 'null':
    default:
      value = null
      break
  }

  return {
    type: filter.type,
    value
  } as FilterType
}

function dateOneMonthAgo(): Date {
  const date = new Date()
  date.setMonth(date.getMonth() - 1)
  return date
}
