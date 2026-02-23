import module from './module-root.vue'
import Index from './views/index-view.vue'

export default {
  path: '/profile',
  name: 'Профиль',
  component: module, // <-- necessary
  children: [
    // <-- your routes
    {
      path: '',
      name: 'Профиль',
      component: Index
    }
  ]
}
