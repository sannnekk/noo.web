import module from './module.vue'

export default {
  path: '/create-course:courseSlug?',
  name: 'create-course',
  component: module, // <-- necessary
  children: [
    // <-- your routes
    {
      path: '',
      name: 'Создать курс',
      component: () => import('./views/index-view.vue'),
      children: [
        {
          name: 'Создать материал',
          path: ':chapterSlug--:materialSlug',
          component: () => import('./views/material-view.vue')
        }
      ]
    }
  ]
}
