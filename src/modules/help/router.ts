import module from './module-root.vue'
import Index from './views/index-view.vue'

export default {
  path: '/help',
  name: 'Помощь',
  component: module, // <-- necessary
  children: [
    // <-- your routes
    {
      path: '',
      name: 'Помощь',
      component: Index,
      children: [
        {
          path: 'article-:id',
          name: 'Статья',
          component: () => import('./views/article-view.vue')
        }
      ]
    }
  ]
}
