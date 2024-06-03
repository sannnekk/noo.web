import module from './module.vue'

export default {
  path: '/blog',
  name: 'Блог/Новости',
  component: module, // <-- necessary
  children: [
    // <-- your routes
    {
      path: '',
      name: 'Блог/Новости',
      component: () => import('./views/index-view.vue')
    },
    {
      path: 'post/create:id?',
      name: 'Редактирование поста',
      component: () => import('./views/create-blogpost-view.vue')
    },
    {
      path: 'post/:id',
      name: 'Просмотр поста',
      component: () => import('./views/blogpost-view.vue')
    }
  ]
}
