import App from '@/App.vue'
import router from '@/router'
import locales from '@/locales'
import { autoAnimatePlugin } from '@formkit/auto-animate/vue'
import { registerModule } from '@/modules-container'
import type { ApplicationModule } from '@/types/dev/ApplicationModule'
import { createApp } from 'vue'
import { createPinia } from 'pinia'

// adding modules
const modules = import.meta.glob('@/modules/!(__template__)/index.ts', {
  import: 'default',
  eager: true
})
Object.values(modules).forEach((module) =>
  registerModule(module as ApplicationModule)
)

// creating the app
const app = createApp(App)

// adding plugins
app.use(router)
app.use(createPinia())
app.use(locales)
app.use(autoAnimatePlugin)

// adding global components
const components = import.meta.glob('@/components/**/**.vue', {
  import: 'default',
  eager: true
})
Object.entries(components).forEach(([path, component]) => {
  const name = path.split('/').pop()?.split('.')[0]

  if (name) app.component(name, component as any)
})

// mounting the app
app.mount('#root')
