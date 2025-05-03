import type { ApplicationModule } from '@/types/ApplicationModule'
import { routerOptions } from './router'
import { createRouter, type RouteRecordRaw } from 'vue-router'
import { isAuthenticatedGuard } from './router/guards'
import {
  setPageTitleMiddleware,
  setTabTitleMiddleware
} from './router/middlewares'

function registerModules(modules: ApplicationModule[]): {
  router: ReturnType<typeof createRouter>
  diContainer: Record<string, any>
} {
  const options = routerOptions
  const diContainer: Record<string, any> = {}

  for (const module of modules) {
    const { name, diDefinitions, router } = module

    if (router) {
      ;(options.routes as RouteRecordRaw[]).push(router)
    }

    if (diDefinitions) {
      for (const [key, value] of Object.entries(module.diDefinitions)) {
        diContainer[`${name}.${key}`] = value
      }
    }
  }

  const router = createRouter(options)

  router.beforeEach(isAuthenticatedGuard)
  router.afterEach(setTabTitleMiddleware)
  router.afterEach(setPageTitleMiddleware)

  return { router, diContainer }
}

export { registerModules }
