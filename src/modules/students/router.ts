import module from './module.vue'

export default {
  path: '/students',
  name: 'Мои ученики',
  component: module, // <-- necessary
  children: [
    // <-- your routes
    {
      path: '',
      name: 'Мои ученики',
      component: () => import('./views/index.vue')
    }
  ]
}
