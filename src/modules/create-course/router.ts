import module from './module-root.vue'
import generalInfoView from './views/general-info-view.vue'
import indexView from './views/index-view.vue'
import materialView from './views/material-view.vue'

export default {
  path: '/create-course:courseSlug?',
  name: 'create-course',
  component: module, // <-- necessary
  children: [
    // <-- your routes
    {
      path: '',
      name: 'Создать курс',
      component: indexView,
      children: [
        {
          name: 'Общая информация курса',
          path: 'general',
          component: generalInfoView
        },
        {
          name: 'Создать материал',
          path: ':chapterSlug--:materialSlug',
          component: materialView
        }
      ]
    }
  ]
}
