import indexView from './views/index-view.vue'
import module from './module.vue'

export default {
  path: '/course-students',
  name: 'Ученики курса ""',
  component: module,
  children: [
    {
      path: ':courseSlug',
      name: 'Ученики курса',
      component: indexView
    }
  ]
}
