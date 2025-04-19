import type { SearchFilter } from '@/components/search/filters/SearchFilter'
import { Core } from '../../../../core/Core'

export function subjectFilter(prefix?: string): SearchFilter {
  return {
    name: 'Предмет',
    type: 'arr',
    key: prefix ? `${prefix}.subjectId` : 'subjectId',
    arrayOptions: async () => {
      const response = await Core.Services.Subject.getSubjects()

      return response.data.map((subject) => ({
        value: subject.id,
        label: subject.name
      }))
    }
  }
}
