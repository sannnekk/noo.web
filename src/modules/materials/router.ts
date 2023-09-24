import module from './module.vue'
import index from './views/index.vue'

export default {
  path: '/materials',
  name: 'materials',
  component: module, // <-- necessary
  children: [
    // <-- your routes
    {
      path: '',
      name: 'materials.index',
      component: index
    }
  ]
}
