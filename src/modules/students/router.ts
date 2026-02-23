import module from './module-root.vue'
import Index from './views/index-view.vue'

export default {
  path: '/students',
  name: 'Мои ученики',
  component: module, // <-- necessary
  children: [
    // <-- your routes
    {
      path: '',
      name: 'Мои ученики',
      component: Index
    }
  ]
}
