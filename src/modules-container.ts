import router from '@/router'
import type { ApplicationModule } from '@/types/dev/ApplicationModule'

export function registerModule(module: ApplicationModule): void {
  if (module.router) {
    router.addRoute(module.router)
  }
}
