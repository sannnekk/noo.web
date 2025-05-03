import { useAuthStore } from '@/core/stores/auth.store'
import type { NavigationGuardReturn, RouteLocationNormalized } from 'vue-router'

function isAuthenticatedGuard(
  to: RouteLocationNormalized
): NavigationGuardReturn {
  if (to.meta.noAuth) {
    return true
  }

  const authStore = useAuthStore()

  if (!authStore.isAuthenticated && !String(to.name).startsWith('auth')) {
    return {
      name: 'auth.login',
      query: { redirect: to.fullPath }
    }
  }

  return true
}

export { isAuthenticatedGuard }
