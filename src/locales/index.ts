import { createI18n } from 'vue-i18n'
import enComponents from './components/en.json'
import uaComponents from './components/ua.json'
import enComposables from './composables/en.json'
import uaComposables from './composables/ua.json'

export default createI18n({
  legacy: false,
  locale: 'ua',
  fallbackLocale: 'en',
  messages: {
    en: {
      components: enComponents,
      composables: enComposables
    },
    ua: {
      components: uaComponents,
      composables: uaComposables
    }
  }
})
