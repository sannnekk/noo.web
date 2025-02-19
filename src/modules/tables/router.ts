import module from './module-root.vue'
import TableView from './views/table-view.vue'
import Index from './views/index-view.vue'

export default {
  path: '/tables',
  name: 'Таблицы',
  component: module, // <-- necessary
  children: [
    // <-- your routes
    {
      path: '',
      name: 'Список таблиц',
      component: Index
    },
    {
      path: 'create:tableId?',
      name: 'Просмотр таблицы',
      component: TableView
    }
  ]
}
