import { Core } from '@/core/Core'
import type { Pagination } from '@/core/data/Pagination'

export async function fetchUsers(pagination?: Pagination) {
  try {
    return await Core.Services.User.getUsers(pagination)
  } catch (error: any) {
    Core.Services.UI.openErrorModal(
      'Ошибка при загрузке пользователей',
      error.message
    )
  }
}

export async function fetchUserRoles(pagination?: Pagination) {
  const roles = [
    { label: 'Администратор', role: 'admin', id: '1' },
    { label: 'Ученик', role: 'student', id: '2' },
    { label: 'Учитель', role: 'teacher', id: '3' },
    { label: 'Куратор', role: 'mentor', id: '4' }
  ]

  if (pagination?.search) {
    const selectedRoles = roles.filter((role) =>
      role.label.toLowerCase().includes(pagination.search!.toLowerCase())
    )
    return {
      data: selectedRoles,
      meta: { total: selectedRoles.length, relations: [] }
    }
  }

  return { data: roles, meta: { total: roles.length, relations: [] } }
}

export async function fetchPolls(pagination?: Pagination) {
  try {
    return await Core.Services.Poll.getPolls(pagination)
  } catch (error: any) {
    Core.Services.UI.openErrorModal(
      'Ошибка при загрузке опросов',
      error.message
    )
  }
}

export async function fetchPollQuestions(pagination?: Pagination) {
  try {
    return await Core.Services.Poll.getPollQuestions(pagination)
  } catch (error: any) {
    Core.Services.UI.openErrorModal(
      'Ошибка при загрузке вопросов',
      error.message
    )
  }
}
