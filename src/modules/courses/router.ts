import module from './module-root.vue'
import courseView from './views/course-view.vue'
import indexView from './views/index-view.vue'
import materialView from './views/material-view.vue'

export default {
  path: '/courses',
  name: 'Мои курсы',
  component: module,
  children: [
    {
      path: '',
      name: 'Мои курсы',
      component: indexView
    },
    {
      path: ':courseSlug',
      name: 'Курс',
      component: courseView,
      children: [
        {
          path: ':slug?',
          name: 'Просмотр курса',
          component: materialView
        }
      ]
    }
  ]
}
