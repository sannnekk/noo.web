import module from './module.vue'
import index from './views/index.vue'
import paneLayout from '@/layouts/pane-layout.vue'

export default {
  path: '/[route-path]',
  name: '[route-name]',
  component: module, // <-- necessary
  meta: {
    layout: 'div' // <-- your layout, paneLayout if it is not set
  },
  children: [
    // <-- your routes
    {
      path: '',
      name: '[route-name].[child-name]',
      component: index
    }
  ]
}
