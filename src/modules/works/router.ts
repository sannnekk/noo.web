import module from './module-root.vue'
import index from './views/index-view.vue'

export default {
  path: '/works',
  name: 'works',
  component: module, // <-- necessary
  children: [
    // <-- your routes
    {
      path: '',
      name: 'Все работы',
      component: index
    }
  ]
}
