import module from './module-root.vue'
import index from './views/index-view.vue'

export default {
  path: '/calender',
  name: 'Календарь',
  component: module, // <-- necessary
  children: [
    // <-- your routes
    {
      path: '',
      name: 'Календарь',
      component: index
    }
  ]
}
