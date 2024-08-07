import module from './module-root.vue'
import EditUserView from './views/edit-user-view.vue'
import Index from './views/index-view.vue'

export default {
  path: '/users',
  name: 'Пользователи',
  component: module, // <-- necessary
  children: [
    // <-- your routes
    {
      path: '',
      name: 'Пользователи',
      component: Index
    },
    {
      path: 'edit/:username',
      name: 'Редактировать пользователя',
      component: EditUserView
    }
  ]
}
