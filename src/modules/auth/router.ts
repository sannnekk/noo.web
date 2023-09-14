import module from './module.vue'
import index from './views/index.vue'

export default {
  path: '/auth',
  name: 'auth',
  component: module, // <-- necessary
  children: [
    // <-- your routes
    {
      path: '',
      name: 'auth.index',
      component: index
    }
  ]
}
