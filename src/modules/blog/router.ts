import module from './module-root.vue'
import IndexView from './views/index-view.vue'
import createBlockpostView from './views/create-blogpost-view.vue'
import blogpostView from './views/blogpost-view.vue'

export default {
  path: '/blog',
  name: 'BlogPosts',
  component: module, // <-- necessary
  children: [
    // <-- your routes
    {
      path: '',
      name: 'Опросы',
      component: IndexView
    },
    {
      path: 'post/create:id?',
      name: 'Редактирование поста',
      component: createBlockpostView
    },
    {
      path: 'post/:id',
      name: 'Просмотр поста',
      component: blogpostView
    }
  ]
}
