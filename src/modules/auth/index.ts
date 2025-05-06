import type { ApplicationModule } from '@/types/ApplicationModule'

const module: ApplicationModule = {
  name: 'auth',
  diDefinitions: {},
  routes: [
    {
      name: 'auth',
      path: '/auth',
      meta: {
        tabTitle: 'НОО.Платформа - авторизация',
        pageTitle: 'НОО.Платформа - авторизация',
        noAuth: true
      },
      component: () => import('./pages/auth-page.vue'),
      children: [
        {
          name: 'auth.login',
          path: 'login',
          meta: {
            pageTitle: 'НОО.Платформа - авторизация',
            tabTitle: 'НОО.Платформа - авторизация'
          },
          component: () => import('./views/auth-login-view.vue')
        },
        {
          name: 'auth.register',
          path: 'register',
          meta: {
            pageTitle: 'НОО.Платформа - регистрация',
            tabTitle: 'НОО.Платформа - регистрация'
          },
          component: () => import('./views/auth-register-view.vue')
        },
        {
          name: 'auth.forgot-password',
          path: 'forgot-password',
          meta: {
            pageTitle: 'НОО.Платформа - восстановление пароля',
            tabTitle: 'НОО.Платформа - восстановление пароля'
          },
          component: () => import('./views/auth-forgot-password-view.vue')
        }
      ]
    }
  ]
}

export default module
