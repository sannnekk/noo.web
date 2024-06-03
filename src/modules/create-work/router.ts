import module from './module.vue'

export default {
  path: '/create-work:workSlug?',
  name: 'Создание работы',
  component: module, // <-- necessary
  children: [
    // <-- your routes
    {
      path: '',
      name: 'Список заданий',
      component: () => import('./views/index-view.vue'),
      children: [
        {
          path: 'general-info',
          name: 'Общая информация',
          component: () => import('./views/general-info-view.vue')
        },
        {
          path: ':taskSlug',
          name: 'Список заданий',
          component: () => import('./views/task-form-view.vue')
        }
      ]
    },
    {
      path: 'success',
      name: 'Работа создана',
      component: () => import('./views/success-view.vue')
    }
  ]
}
