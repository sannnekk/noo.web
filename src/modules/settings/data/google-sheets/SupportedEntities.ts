import type { SupportedEntity } from '../../types/google-sheets/SupportedEntity'
import {
  fetchCourses,
  fetchPolls,
  fetchUserRoles
} from '../../utils/google-sheets/fetch'

export const SupportedEntities: SupportedEntity[] = [
  {
    name: 'Результаты опросов',
    technicalName: 'poll_answer',
    icon: 'poll',
    availableSelectorProps: [
      {
        label: 'По опросу',
        value: 'pollId',
        labelKeys: ['title'],
        fetchFunction: fetchPolls,
        toPropValue: (value) => value.id
      }
    ]
  },
  {
    name: 'Пользователи',
    technicalName: 'user',
    icon: 'users',
    availableSelectorProps: [
      {
        label: 'По роли',
        value: 'role',
        labelKeys: ['label'],
        fetchFunction: fetchUserRoles,
        toPropValue: (value) => value.role
      },
      {
        label: 'По курсу',
        value: 'courseId',
        labelKeys: ['name'],
        fetchFunction: fetchCourses,
        toPropValue: (value) => value.id
      }
    ]
  }
]
