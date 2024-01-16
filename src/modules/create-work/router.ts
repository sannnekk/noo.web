import module from './module.vue'
import indexView from './views/index-view.vue'
import successViewVue from './views/success-view.vue'
import taskFormView from './views/task-form-view.vue'
import generalInfoView from './views/general-info-view.vue'

export default {
  path: '/create-work:workSlug?',
  name: 'Создание работы',
  component: module, // <-- necessary
  children: [
    // <-- your routes
    {
      path: '',
      name: 'Список заданий',
      component: indexView,
      children: [
        {
          path: 'general-info',
          name: 'Общая информация',
          component: generalInfoView
        },
        {
          path: ':taskSlug',
          name: 'Список заданий',
          component: taskFormView
        }
      ]
    },
    {
      path: 'success',
      name: 'Работа создана',
      component: successViewVue
    }
  ]
}
