import router from '@/router'
import locales from '@/locales'
import type { ApplicationModule } from '@/types/dev/ApplicationModule'

export function registerModule(module: ApplicationModule): void {
  if (module.router) {
    router.addRoute(module.router)
  }

  if (module.locales) {
    Object.keys(module.locales).forEach((locale) => {
      locales.global.mergeLocaleMessage(locale, { [module.name]: module.locales[locale] })
    })
  }
}
