import module from './module.vue'
import indexView from './views/index-view.vue'
import successViewVue from './views/success-view.vue'
import taskFormView from './views/task-form-view.vue'
import generalInfoView from './views/general-info-view.vue'

export default {
  path: '/create-work',
  name: 'Создание работы',
  component: module, // <-- necessary
  children: [
    // <-- your routes
    {
      path: '',
      name: 'Список заданий',
      redirect: '/create-work/general-info',
      component: indexView,
      children: [
        {
          path: 'general-info',
          name: 'Общая информация',
          component: generalInfoView
        },
        {
          path: ':taskId',
          name: 'Создание работы',
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
