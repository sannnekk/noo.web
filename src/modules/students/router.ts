import module from './module.vue'
import index from './views/index.vue'

export default {
  path: '/students',
  name: 'Мои ученики',
  component: module, // <-- necessary
  children: [
    // <-- your routes
    {
      path: '',
      name: 'Мои ученики',
      component: index
    }
  ]
}
