import module from './module.vue'
import index from './views/index.vue'
import editUserView from './views/edit-user-view.vue'

export default {
  path: '/users',
  name: 'Пользователи',
  component: module, // <-- necessary
  children: [
    // <-- your routes
    {
      path: '',
      name: 'Пользователи',
      component: index
    },
    {
      path: 'edit/:username',
      name: 'Редактировать пользователя',
      component: editUserView
    }
  ]
}
