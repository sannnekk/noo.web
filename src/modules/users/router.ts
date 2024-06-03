import module from './module.vue'

export default {
  path: '/users',
  name: 'Пользователи',
  component: module, // <-- necessary
  children: [
    // <-- your routes
    {
      path: '',
      name: 'Пользователи',
      component: () => import('./views/index.vue')
    },
    {
      path: 'edit/:username',
      name: 'Редактировать пользователя',
      component: () => import('./views/edit-user-view.vue')
    }
  ]
}
