import type { SearchFilter } from '@/components/search/filters/SearchFilter'

export function checkStatusFilter(prefix?: string): SearchFilter {
  return {
    name: 'Статус проверки',
    type: 'arr',
    key: prefix ? `${prefix}.checkStatus` : 'checkStatus',
    arrayOptions: [
      { label: 'Не проверено', value: 'not-checked' },
      { label: 'В процессе', value: 'in-progress' },
      { label: 'Проверено в дедлайн', value: 'checked-in-deadline' },
      { label: 'Проверено после дедлайна', value: 'checked-after-deadline' },
      { label: 'Проверено автоматически', value: 'checked-automatically' }
    ]
  }
}
