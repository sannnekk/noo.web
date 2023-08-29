import module from './module.vue'
import index from './views/index.vue'

export default {
  path: '/[route-path]',
  name: '[route-name]',
  component: module, // <-- necessary
  children: [
    // <-- your routes
    {
      path: '',
      name: '[route-name].[child-name]',
      component: index
    }
  ]
}
