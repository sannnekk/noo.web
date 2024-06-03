import module from './module.vue'

export default {
  path: '/profile',
  name: 'Профиль',
  component: module, // <-- necessary
  children: [
    // <-- your routes
    {
      path: '',
      name: 'Профиль',
      component: () => import('./views/index.vue')
    }
  ]
}
