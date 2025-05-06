import { useAuthStore } from '@/core/stores/auth.store'
import { useGlobalUIStore } from '@/core/stores/global-ui.store'
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

function canRoleAccessGuard(
  to: RouteLocationNormalized
): NavigationGuardReturn {
  const authStore = useAuthStore()
  const globalUiStore = useGlobalUIStore()

  if (!to.meta.roles) {
    return true
  }

  if (!authStore.roleIsOneOf(to.meta.roles)) {
    globalUiStore.createApiErrorToast

    return false
  }

  return true
}

export { isAuthenticatedGuard, canRoleAccessGuard }
