import type { SearchFilter } from '@/components/search/filters/SearchFilter'

export function workTypeFilter(prefix?: string): SearchFilter {
  return {
    name: 'Тип работы',
    type: 'arr',
    key: prefix ? `${prefix}.type` : 'type',
    arrayOptions: [
      { label: 'Тест', value: 'test' },
      { label: 'Мини-зачет', value: 'mini-test' },
      { label: 'Вторая часть', value: 'second-part' },
      { label: 'Пробник', value: 'trial-work' },
      { label: 'Фраза', value: 'phrase' }
    ]
  }
}
