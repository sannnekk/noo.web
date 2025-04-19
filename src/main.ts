import App from '@/App.vue'
import router from '@/router'
import { autoAnimatePlugin } from '@formkit/auto-animate/vue'
import { registerModule } from '@/modules-container'
import type { ApplicationModule } from '@/types/ApplicationModule'
import { createApp } from 'vue'
import { createPinia } from 'pinia'

const app = createApp(App)

// adding modules
const modules = import.meta.glob('@/modules/!(__template__)/index.ts', {
  import: 'default',
  eager: true
})

Object.values(modules).forEach((module) =>
  registerModule(module as ApplicationModule)
)

// adding plugins
app.use(router)
app.use(createPinia())
app.use(autoAnimatePlugin)

// mounting the app
app.mount('#root')
