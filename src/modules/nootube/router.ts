import module from './module-root.vue'
import IndexView from './views/index-view.vue'

export default {
  path: '/nootube',
  name: 'nootube',
  component: module, // <-- necessary
  children: [
    // <-- your routes
    {
      path: '',
      name: 'НОО.Tube',
      component: IndexView
    },
    {
      path: 'video/:id',
      name: 'Видео',
      component: () => import('./views/video-view.vue')
    },
    {
      path: 'upload-video',
      name: 'Загрузка видео',
      component: () => import('./views/upload-video-view.vue')
    }
  ]
}
