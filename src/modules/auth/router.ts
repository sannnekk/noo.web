import module from './module-root.vue'

export default {
  path: '/auth',
  name: 'auth',
  component: module, // <-- necessary
  meta: {
    layout: 'div' // <-- your layout, paneLayout if it is not set
  },
  children: [
    // <-- your routes
    {
      path: '',
      name: 'auth.index',
      component: () => import('./views/index-view.vue')
    }
  ]
}
