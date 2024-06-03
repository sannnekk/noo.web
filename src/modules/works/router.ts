import module from './module.vue'
import paneLayout from '@/layouts/pane-layout.vue'

export default {
  path: '/works',
  name: 'works',
  component: module, // <-- necessary
  meta: {
    layout: paneLayout // <-- your layout, paneLayout if it is not set
  },
  children: [
    // <-- your routes
    {
      path: '',
      name: 'Все работы',
      component: () => import('./views/index-view.vue')
    }
  ]
}
