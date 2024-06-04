import module from './module.vue'
import index from './views/index.vue'

export default {
  path: '/calender',
  name: 'Календарь',
  component: module, // <-- necessary
  children: [
    // <-- your routes
    {
      path: '',
      name: 'Календарь',
      component: () => index
    }
  ]
}
