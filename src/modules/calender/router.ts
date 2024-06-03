import module from './module.vue'

export default {
  path: '/calender',
  name: 'Календарь',
  component: module, // <-- necessary
  children: [
    // <-- your routes
    {
      path: '',
      name: 'Календарь',
      component: () => import('./views/index.vue')
    }
  ]
}
