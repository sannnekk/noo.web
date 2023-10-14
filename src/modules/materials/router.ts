import module from './module.vue'
import courseView from './views/course-view.vue'
import indexView from './views/index-view.vue'
import materialView from './views/material-view.vue'

export default {
  path: '/materials',
  name: 'Мои курсы',
  component: module,
  children: [
    {
      path: '',
      name: 'Мои курсы',
      component: indexView
    },
    {
      path: ':course',
      name: 'Курс',
      component: courseView,
      children: [
        {
          path: ':slug?',
          name: 'Химия',
          component: materialView
        }
      ]
    }
  ]
}
