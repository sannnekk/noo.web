import type { SearchFilter } from '@/components/search/filters/SearchFilter'

export function solveStatusFilter(prefix?: string): SearchFilter {
  return {
    name: 'Статус решения',
    type: 'arr',
    key: prefix ? `${prefix}.solveStatus` : 'solveStatus',
    arrayOptions: [
      { label: 'Не начато', value: 'not-started' },
      { label: 'В процессе', value: 'in-progress' },
      { label: 'Сдано в дедлайн', value: 'made-in-deadline' },
      { label: 'Сдано после дедлайна', value: 'made-after-deadline' }
    ]
  }
}
