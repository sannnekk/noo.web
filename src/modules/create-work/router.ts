import module from './module.vue'
import GeneralInfoView from './views/general-info-view.vue'
import index from './views/index-view.vue'
import TaskFormView from './views/task-form-view.vue'

export default {
  path: '/create-work:workSlug?',
  name: 'Создание работы',
  component: module, // <-- necessary
  children: [
    // <-- your routes
    {
      path: '',
      name: 'Список заданий',
      component: () => index,
      children: [
        {
          path: 'general-info',
          name: 'Общая информация',
          component: () => GeneralInfoView
        },
        {
          path: ':taskSlug',
          name: 'Список заданий',
          component: () => TaskFormView
        }
      ]
    },
    {
      path: 'success',
      name: 'Работа создана',
      component: () => import('./views/success-view.vue')
    }
  ]
}
