import { createWebHistory, type RouterOptions } from 'vue-router'

const routerOptions: RouterOptions = {
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      name: 'root',
      path: '/',
      redirect: { name: 'courses' },
      meta: {
        noAuth: true,
        pageTitle: 'Главная',
        tabTitle: 'НОО.Платформа'
      }
    }
  ]
}

export { routerOptions }
