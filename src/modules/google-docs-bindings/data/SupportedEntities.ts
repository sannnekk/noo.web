import type { SupportedEntity } from '../types/SupportedEntity'
import {
  fetchPollQuestions,
  fetchPolls,
  fetchUserRoles,
  fetchUsers
} from '../utils/fetch'

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
      },
      {
        label: 'По вопросу',
        value: 'questionId',
        labelKeys: ['poll.title', 'text'],
        fetchFunction: fetchPollQuestions,
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
        label: 'По никнейму',
        value: 'name',
        labelKeys: ['username'],
        fetchFunction: fetchUsers,
        toPropValue: (value) => value.username
      },
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
