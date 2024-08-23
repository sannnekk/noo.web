import type { SearchFilter } from '@/components/search/filters/SearchFilter'
import { Core } from '../Core'

export const subjectFilter: SearchFilter = {
  name: 'Предмет',
  type: 'arr',
  key: 'subjectId',
  arrayOptions: async () => {
    const response = await Core.Services.Subject.getSubjects()

    return response.data.map((subject) => ({
      value: subject.id,
      label: subject.name
    }))
  }
}
