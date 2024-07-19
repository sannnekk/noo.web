import indexView from './views/index-view.vue'
import module from './module.vue'

export default {
  path: '/create-chapter',
  name: 'Создание главы',
  component: module,
  children: [
    {
      path: ':courseSlug',
      name: 'Создать главу',
      component: indexView
    }
  ]
}
