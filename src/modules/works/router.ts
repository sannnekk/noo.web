import module from './module.vue'
import indexView from './views/index-view.vue'
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
      name: 'Работы',
      component: indexView
    }
  ]
}
