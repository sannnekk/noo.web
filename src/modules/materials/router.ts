import module from './module.vue'
import index from './views/index.vue'
import material from './views/material.vue'

export default {
  path: '/materials',
  name: 'Материалы',
  component: module,
  children: [
    {
      path: '',
      name: 'Материалы',
      component: index,
      children: [
        {
          path: ':slug?',
          name: 'Материал',
          component: material
        }
      ]
    }
  ]
}
