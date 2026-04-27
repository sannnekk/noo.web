import module from './module-root.vue'

export default {
  path: '/auth',
  name: 'auth',
  component: module, // <-- necessary
  meta: {
    layout: 'div' // <-- your layout, paneLayout if it is not set
  },
  children: [
    // <-- your routes
    {
      path: '',
      name: 'auth.index',
      component: () => import('./views/index-view.vue'),
      children: [
        {
          path: '',
          name: 'auth.login',
          component: () => import('./views/login-view.vue')
        },
        {
          path: 'register',
          name: 'auth.register',
          component: () => import('./views/register-view.vue')
        },
        {
          path: 'forgot-password',
          name: 'auth.forgot-password',
          component: () => import('./views/forgot-password-view.vue')
        },
        {
          path: 'resend-verification',
          name: 'auth.resend-verification',
          component: () => import('./views/resend-verification-view.vue')
        }
      ]
    }
  ]
}
