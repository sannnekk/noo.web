import module from './module.vue'
import index from './views/index.vue'

export default {
  path: '/users',
  name: 'Пользователи',
  component: module, // <-- necessary
  children: [
    // <-- your routes
    {
      path: '',
      name: 'Пользователи',
      component: index
    }
  ]
}
