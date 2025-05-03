import module from './module-root.vue'
import GeneralInfoView from './views/general-info-view.vue'
import index from './views/index-view.vue'
import TaskFormView from './views/task-form-view.vue'

export default {
  path: '/create-work:workSlug?',
  name: 'Создание работы',
  component: module, // <-- necessary
  children: [
    {
      path: '',
      name: 'Создание работы',
      component: index,
      children: [
        {
          path: 'general-info',
          name: 'О работе',
          component: GeneralInfoView
        },
        {
          path: ':taskSlug',
          name: 'Список заданий',
          component: TaskFormView
        }
      ]
    }
  ]
}
