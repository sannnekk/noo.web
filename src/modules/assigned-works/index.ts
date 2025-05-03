import type { ApplicationModule } from '@/types/ApplicationModule'
import { AssignedWorkService } from './api/assigned-work.service'
import { assignedWorkDetailInitGuard, assignedWorkModeGuard } from './guards'

const module: ApplicationModule = {
  name: 'assigned-works',
  diDefinitions: {
    assignedWorkService: AssignedWorkService
  },
  routes: [
    {
      name: 'assigned-works.list',
      path: '/assigned-works',
      meta: {
        pageTitle: 'Мои работы',
        tabTitle: 'Мои работы'
      },
      component: () => import('./pages/assigned-works-list-page.vue'),
      props: (route) => {
        return {
          tabId: String(route.query.tabId),
          userId: String(route.query.userId)
        }
      }
    },
    {
      name: 'assigned-works.detail',
      path: ':assignedWorkId/:mode?',
      meta: {
        pageTitle: 'Работа',
        tabTitle: 'Работа',
        warnOnLeave: true
      },
      component: () => import('./views/assigned-works-detail-page.vue'),
      beforeEnter: [assignedWorkDetailInitGuard, assignedWorkModeGuard],
      props: (route) => {
        return {
          assignedWorkId: route.params.assignedWorkId as string,
          mode: route.params.mode as string
        }
      },
      children: [
        {
          name: 'assigned-works.detail.comments',
          path: 'comments',
          meta: {
            pageTitle: 'Комментарии',
            tabTitle: 'Комментарии к работе'
          },
          component: () => import('./views/assigned-works-comments-view.vue')
        },
        {
          name: 'assigned-works.detail.task',
          path: ':taskId',
          meta: {
            pageTitle: 'Задание',
            tabTitle: 'Задание'
          },
          component: () => import('./views/assigned-works-task-view.vue'),
          props: (route) => {
            return {
              taskId: route.params.taskId
            }
          }
        }
      ]
    }
  ]
}

export default module
