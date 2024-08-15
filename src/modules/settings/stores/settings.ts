import { Core } from '@/core/Core'
import { defineStore } from 'pinia'
import { computed } from 'vue'
import type { SettingsNavEntry } from '../types/SettingsNavEntry'

export const useSettingsStore = defineStore('settings-module:settings', () => {
  const allNavEntries: SettingsNavEntry[] = [
    {
      title: 'Аккаунт',
      description: 'Смена пароля, активные сессии, удаление аккаунта',
      icon: 'user',
      route: '/settings/account',
      for: ['student', 'teacher', 'mentor', 'admin']
    },
    {
      title: 'Telegram',
      description: 'Привязка Telegram к профилю, уведомления',
      icon: 'telegram-blue',
      route: '/settings/telegram',
      for: ['student', 'mentor', 'teacher', 'admin']
    },
    {
      title: 'Google Sheets',
      description: 'Интеграции с Google Sheets и Google Drive',
      icon: 'google-sheets',
      route: '/settings/google-sheets',
      for: ['teacher', 'admin']
    },
    {
      title: 'Сниппеты',
      description: 'Создание и редактирование сниппетов',
      icon: 'keyboard',
      route: '/settings/mentor-snippets',
      for: ['mentor']
    },
    {
      title: 'Предметы',
      description: 'Просмотр, создание и редактирование предметов',
      icon: 'subject',
      route: '/settings/subjects',
      for: ['teacher', 'admin', 'mentor']
    },
    {
      title: 'Общая информация',
      description: 'Информация о платформе, версиях и changelog',
      icon: 'info',
      route: '/settings/platform-info',
      for: ['teacher', 'admin', 'teacher', 'mentor']
    },
    {
      title: 'Опасная зона',
      description: 'Удаление данных, сброс настроек, опасные действия',
      icon: 'cross-red',
      route: '/settings/danger-zone',
      for: ['admin']
    }
  ]

  const navEntries = computed(() => {
    return allNavEntries.filter((entry) =>
      entry.for.includes(Core.Context.User?.role!)
    )
  })

  return {
    navEntries
  }
})
