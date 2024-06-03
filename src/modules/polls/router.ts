import module from './module.vue'

export default {
  path: '/poll/:pollId',
  name: 'Опросы',
  component: module, // <-- necessary
  children: [
    // <-- your routes
    {
      path: '',
      name: 'Опрос',
      component: () => import('./views/index-view.vue')
    },
    {
      path: 'results',
      name: 'Результаты опроса',
      component: () => import('./views/results-view.vue')
    },
    {
      path: 'results/:username',
      name: 'Результаты пользователя',
      component: () => import('./views/user-result-view.vue')
    }
  ]
}
