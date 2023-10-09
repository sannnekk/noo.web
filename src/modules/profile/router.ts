import module from './module.vue'
import index from './views/index.vue'

export default {
  path: '/profile',
  name: 'Профиль',
  component: module, // <-- necessary
  children: [
    // <-- your routes
    {
      path: '',
      name: 'Профиль',
      component: index
    }
  ]
}
