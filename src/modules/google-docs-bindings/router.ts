import module from './module-root.vue'
import paneLayout from '@/layouts/pane-layout.vue'
import index from './views/index-view.vue'

export default {
  path: '/google-docs-bindings',
  name: 'google-docs-bindings',
  component: module, // <-- necessary
  meta: {
    layout: paneLayout // <-- your layout, paneLayout if it is not set
  },
  children: [
    // <-- your routes
    {
      path: '',
      name: 'Google Docs',
      component: index
    },
    {
      path: 'create',
      name: 'Создание интеграции',
      component: () => import('./views/create-binding-view.vue')
    }
  ]
}
