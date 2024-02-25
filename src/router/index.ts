import { Core } from '@/core/Core'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: []
})

router.beforeEach((to, from, next) => {
  if (to.path !== '/auth' && !Core.Context.isLoggedIn()) next('/auth')
  else next()
})

export default router
