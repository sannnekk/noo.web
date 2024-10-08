import module from './module-root.vue'
import index from './views/index-view.vue'
import WorkView from './views/work-view.vue'
import TaskView from './views/task-view.vue'
import WorkCommentsView from './views/work-comments-view.vue'

export default {
  path: '/assigned-works',
  name: 'assigned-works',
  component: module, // <-- necessary
  children: [
    // <-- your routes
    {
      path: '',
      name: 'Работы',
      component: index
    },
    {
      path: ':workId',
      name: 'Работа',
      component: WorkView,
      redirect: 'read',
      children: [
        {
          path: ':mode',
          name: 'Комментарии к работе',
          component: WorkCommentsView
        },
        {
          path: ':mode/:taskSlug',
          name: 'Задания',
          component: TaskView
        }
      ]
    }
  ]
}
