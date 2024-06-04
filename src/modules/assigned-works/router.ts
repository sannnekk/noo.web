import module from './module.vue'
import paneLayout from '@/layouts/pane-layout.vue'
import index from './views/index-view.vue'
import WorkView from './views/work-view.vue'
import TaskView from './views/task-view.vue'

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
      component: () => index
    },
    {
      path: ':workId',
      name: 'Работа',
      component: WorkView,
      redirect: 'read',
      children: [
        {
          path: ':mode/:taskSlug?',
          name: 'Работа',
          component: () => TaskView
        }
      ]
    }
  ]
}
