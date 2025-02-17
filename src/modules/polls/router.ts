import module from './module-root.vue'
import IndexView from './views/index-view.vue'
import CreatePollView from './views/create-poll-view.vue'
import pollView from './views/poll-view.vue'
import ResultsView from './views/results-view.vue'
import UserResultView from './views/user-result-view.vue'

export default {
  path: '/polls',
  name: 'Polls',
  component: module,
  children: [
    {
      path: '',
      name: 'Опросы',
      component: IndexView
    },
    {
      path: 'create-poll:pollId?',
      name: 'Создание опроса',
      component: CreatePollView
    },
    {
      path: ':pollId',
      name: 'Опрос',
      component: pollView
    },
    {
      path: ':pollId/results',
      name: 'Результаты опроса',
      component: ResultsView
    },
    {
      path: ':pollId/results/:username',
      name: 'Результаты пользователя',
      component: UserResultView
    }
  ]
}
