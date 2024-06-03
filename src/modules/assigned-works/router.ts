import module from './module.vue'
import paneLayout from '@/layouts/pane-layout.vue'

export default {
  path: '/assigned-works',
  name: 'assigned-works',
  component: module, // <-- necessary
  meta: {
    layout: paneLayout // <-- your layout, paneLayout if it is not set
  },
  children: [
    // <-- your routes
    {
      path: '',
      name: 'Работы',
      component: () => import('./views/index-view.vue')
    },
    {
      path: ':workId',
      name: 'Работа',
      component: () => import('./views/work-view.vue'),
      redirect: 'read',
      children: [
        {
          path: ':mode/:taskSlug?',
          name: 'Работа',
          component: () => import('./views/task-view.vue')
        }
      ]
    }
  ]
}
