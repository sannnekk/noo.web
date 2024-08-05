import type { SupportedEntity } from '../types/SupportedEntity'
import { fetchPolls, fetchUserRoles } from '../utils/fetch'

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
      }
    ]
  }
]
