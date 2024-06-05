import module from './module.vue'
import index from './views/index-view.vue'
import ResultsView from './views/results-view.vue'
import UserResultView from './views/user-result-view.vue'

export default {
  path: '/poll/:pollId',
  name: 'Опросы',
  component: module, // <-- necessary
  children: [
    // <-- your routes
    {
      path: '',
      name: 'Опрос',
      component: index
    },
    {
      path: 'results',
      name: 'Результаты опроса',
      component: ResultsView
    },
    {
      path: 'results/:username',
      name: 'Результаты пользователя',
      component: UserResultView
    }
  ]
}
