import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: []
})

router.beforeEach((to, from, next) => {
  if (to.path === '/') next('/profile')
  else next()
})

export default router
