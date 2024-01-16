import module from './module.vue'
import indexView from './views/index-view.vue'
import workView from './views/work-view.vue'
import taskView from './views/task-view.vue'
import transferWorkView from './views/transfer-work-view.vue'
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
      component: indexView
    },
    {
      path: 'transfer-:workId',
      name: 'Передать работу',
      component: transferWorkView
    },
    {
      path: ':workId',
      name: 'Работа',
      component: workView,
      redirect: 'read',
      children: [
        {
          path: ':mode/:taskSlug?',
          name: 'Работа',
          component: taskView
        }
      ]
    }
  ]
}
