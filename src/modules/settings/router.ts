import module from './module-root.vue'
import Index from './views/index-view.vue'

export default {
  path: '/settings',
  name: 'Найтройки',
  component: module, // <-- necessary
  children: [
    // <-- your routes
    {
      path: '',
      name: 'Настройки',
      component: Index,
      children: [
        {
          path: 'account',
          name: 'Аккаунт',
          component: () => import('./views/account-view.vue')
        },
        {
          path: 'telegram',
          name: 'Telegram',
          component: () => import('./views/telegram-view.vue')
        },
        {
          path: 'personalization',
          name: 'Персонализация',
          component: () => import('./views/personalization-view.vue')
        },
        {
          path: 'google-sheets',
          name: 'Google Sheets',
          component: () => import('./views/google-sheets-view.vue')
        },
        {
          path: 'mentor-snippets',
          name: 'Сниппеты',
          component: () => import('./views/snippets-view.vue')
        },
        {
          path: 'subjects',
          name: 'Предметы',
          component: () => import('./views/subjects-view.vue')
        },
        {
          path: 'help-page',
          name: 'Страница помощи',
          component: () => import('./views/help-page-view.vue')
        },
        {
          path: 'notifications',
          name: 'Уведомления',
          component: () => import('./views/notifications-view.vue')
        },
        {
          path: 'platform-info',
          name: 'Общая информация',
          component: () => import('./views/platform-info-view.vue')
        },
        {
          path: 'danger-zone',
          name: 'Опасная зона',
          component: () => import('./views/danger-zone-view.vue')
        }
      ]
    }
  ]
}
