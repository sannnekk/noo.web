import module from './module-root.vue'
import IndexView from './views/index-view.vue'

export default {
  path: '/nootube',
  name: 'НОО.Tube',
  component: module, // <-- necessary
  children: [
    // <-- your routes
    {
      path: '',
      name: 'НОО.Tube',
      component: IndexView
    }
  ]
}
