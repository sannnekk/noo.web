import module from './module.vue'
import index from './views/index-view.vue'
import createBlockpostView from './views/create-blogpost-view.vue'
import blogpostView from './views/blogpost-view.vue'

export default {
  path: '/blog',
  name: 'Блог/Новости',
  component: module, // <-- necessary
  children: [
    // <-- your routes
    {
      path: '',
      name: 'Блог/Новости',
      component: () => index
    },
    {
      path: 'post/create:id?',
      name: 'Редактирование поста',
      component: () => createBlockpostView
    },
    {
      path: 'post/:id',
      name: 'Просмотр поста',
      component: () => blogpostView
    }
  ]
}
